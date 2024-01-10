import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, DocumentReference } from 'firebase/firestore';
import { EVENTS_COLLECTION } from '~/lib/firestore-collections';
import { EventData } from '../types/event';

type Response = WithId<EventData>;

/**
 * @name useFetchEvent
 * @description Returns a stream with the selected event's data
 * @param eventId
 */
export function useFetchEvent(eventId: string) {
  const firestore = useFirestore();

  const ref = doc(
    firestore,
    EVENTS_COLLECTION,
    eventId
  ) as DocumentReference<Response>;

  return useFirestoreDocData(ref, { idField: 'id' });
}
