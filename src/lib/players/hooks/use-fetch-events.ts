import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';
import { useFirestore, useFirestoreCollection } from 'reactfire';
import {
  EVENTS_COLLECTION,
  USERS_COLLECTION,
} from '~/lib/firestore-collections';
import { useEffect, useMemo, useReducer } from 'react';
import { UserData } from '~/core/session/types/user-data';
import { EventData } from '../types/event';

interface State {
  events: WithId<EventData>[];
  users: Record<string, UserData>;
}

const initialState: State = {
  events: [],
  users: {},
};

type ActionType =
  | { type: 'SET_EVENTS'; payload: WithId<EventData>[] }
  | { type: 'SET_USERS'; payload: Record<string, UserData> };

function eventsReducer(state: State, action: ActionType): State {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_USERS':
      return { ...state, users: { ...state.users, ...action.payload } };
    default:
      return state;
  }
}

export function useFetchEvents(userId: string) {
  const firestore = useFirestore();
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const collectionRef = collection(
    firestore,
    EVENTS_COLLECTION
  ) as CollectionReference<WithId<EventData>>;

  const createdEventsQuery = query(
    collectionRef,
    where('createdBy', '==', userId)
  );
  const { data: createdEventsQuerySnapshot, status: createdEventsStatus } =
    useFirestoreCollection(createdEventsQuery, { idField: 'id' });

  const invitedEventsQuery = query(
    collectionRef,
    where('playerId', '==', userId)
  );
  const { data: invitedEventsQuerySnapshot, status: invitedEventsStatus } =
    useFirestoreCollection(invitedEventsQuery, { idField: 'id' });

  const isLoading = useMemo(
    () =>
      createdEventsStatus === 'loading' || invitedEventsStatus === 'loading'
        ? true
        : false,
    [createdEventsStatus, invitedEventsStatus]
  );

  const uniqueUserIds = useMemo(
    () => [...new Set([...state.events.map((doc) => doc.playerId)])],
    [state.events]
  );

  useEffect(() => {
    if (isLoading) return;

    const createdEvents = createdEventsQuerySnapshot.docs.map((doc) =>
      doc.data()
    );
    const invitedEvents = invitedEventsQuerySnapshot.docs.map((doc) =>
      doc.data()
    );
    const events = [...createdEvents, ...invitedEvents];

    dispatch({ type: 'SET_EVENTS', payload: events });
  }, [createdEventsQuerySnapshot, invitedEventsQuerySnapshot, isLoading]);

  useEffect(() => {
    if (isLoading && state.events.length === 0) return;
    const fetchUserData = async () => {
      // get all unique user IDs
      const users: Record<string, UserData> = {};
      for (const id of uniqueUserIds) {
        if (!id) continue;
        const userSnapshot = await getDoc(doc(firestore, USERS_COLLECTION, id));
        const userData = userSnapshot.data() as UserData;
        users[id] = userData;
      }

      if (Object.keys(users).length) {
        dispatch({ type: 'SET_USERS', payload: users });
      }
    };

    fetchUserData();
  }, [firestore, isLoading, uniqueUserIds, state.events]); // use the mapped IDs as dependency

  return {
    status: isLoading ? 'loading' : 'success',
    ...state,
  };
}
