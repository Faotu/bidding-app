import { doc, DocumentReference } from 'firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { GROUPS_COLLECTION } from '~/lib/firestore-collections';
import { Group } from '../types/group';

type Response = WithId<Group>;
/**
 * @name useFetchGroups
 * @description Fetch the all groups
 * @param groupId
 */
export function useFetchGroupData(groupId: string) {
  const firestore = useFirestore();

  const ref = doc(
    firestore,
    GROUPS_COLLECTION,
    groupId
  ) as DocumentReference<Response>;

  return useFirestoreDocData(ref, { idField: 'id' });
}
