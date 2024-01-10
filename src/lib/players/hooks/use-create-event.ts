import { useCallback } from 'react';
import { useUser } from 'reactfire';

import { FirebaseError } from 'firebase/app';

import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';

import { useRequestState } from '~/core/hooks/use-request-state';
import { EventData } from '~/lib/players/types/event';

import { EVENTS_COLLECTION } from '~/lib/firestore-collections';
import { dateToStringConverter } from '~/core/firebase/utils/date-to-string-converter';

/**
 * @name useCreateEvent
 * @description Hook to create a new event
 */
export function useCreateEvent() {
  const user = useUser();
  const userId = user.data?.uid as string;

  const { state, setError, setData, setLoading } =
    useRequestState<WithId<EventData>>();

  const createEventCallback = useCallback(
    async (
      payload: Omit<EventData, 'createdBy' | 'createdAt' | 'updatedAt'>
    ) => {
      const firestore = getFirestore();
      const batch = writeBatch(firestore);

      try {
        setLoading(true);

        const events = collection(firestore, EVENTS_COLLECTION).withConverter(
          dateToStringConverter
        );
        const eventDoc = doc(events);
        const eventData: WithId<EventData> = {
          id: eventDoc.id,
          start: new Date(payload.start),
          end: new Date(payload.end),
          title: payload.title,
          playerId: payload.playerId,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          isUnavailable: true,
        };

        batch.set(eventDoc, eventData);
        await batch.commit();
        setData({ ...eventData, id: eventDoc.id });
      } catch (e) {
        setError((e as FirebaseError).message);
        return Promise.reject(e);
      }
    },
    [setData, setError, setLoading, userId]
  );

  return [createEventCallback, state] as [
    typeof createEventCallback,
    typeof state
  ];
}
