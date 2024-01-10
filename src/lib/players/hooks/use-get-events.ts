import {
  collection,
  CollectionReference,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollection,
} from 'reactfire';
import { EVENTS_COLLECTION } from '~/lib/firestore-collections';
import { EventData } from '../types/event';
import { dateToStringConverter } from '~/core/firebase/utils/date-to-string-converter';

/**
 * @name useGetEvents
 * @description Fetch the all events for a player
 * @param playerId
 */
export function useGetEvents(
  playerId: string
): ObservableStatus<QuerySnapshot<EventData>> {
  const firestore = useFirestore();
  const collectionRef = collection(firestore, EVENTS_COLLECTION).withConverter(
    dateToStringConverter
  ) as CollectionReference<EventData>;
  const scheduleQuery = query(collectionRef, where('playerId', '==', playerId));
  return useFirestoreCollection(scheduleQuery, { idField: 'id' });
}
