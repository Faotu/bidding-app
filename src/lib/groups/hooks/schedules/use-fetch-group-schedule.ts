import {
  collection,
  CollectionReference,
  doc,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import {
  ObservableStatus,
  useFirestore,
  useFirestoreCollection,
} from 'reactfire';
import {
  GROUPS_COLLECTION,
  SCHEDULES_COLLECTION,
} from '~/lib/firestore-collections';
import { Schedule } from '../../types/group';
import { dateToStringConverter } from '~/core/firebase/utils/date-to-string-converter';

/**
 * @name useFetchGroupSchedules
 * @description Fetch the all groups
 * @param groupId
 */
export function useFetchGroupScheduleData(
  groupId: string
): ObservableStatus<QuerySnapshot<WithId<Schedule>>> {
  const firestore = useFirestore();
  const group = doc(firestore, GROUPS_COLLECTION, groupId);
  const collectionRef = collection(
    group,
    SCHEDULES_COLLECTION
  ).withConverter(
    dateToStringConverter
  ) as CollectionReference<WithId<Schedule>>;
  const scheduleQuery = query(collectionRef, where('groupId', '==', groupId));
  return useFirestoreCollection(scheduleQuery, { idField: 'id' });
}
