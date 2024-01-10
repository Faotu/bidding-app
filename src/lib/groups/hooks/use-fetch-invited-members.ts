import { collection, CollectionReference } from 'firebase/firestore';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';

import {
  INVITES_COLLECTION,
  GROUPS_COLLECTION,
} from '~/lib/firestore-collections';
import { GroupMembershipInvite } from '../types/membership-invite';

/**
 * @description Hook to fetch the organization's invited members
 * @param groupId
 */
export function useFetchInvitedMembers(groupId: string) {
  const firestore = useFirestore();

  const collectionRef = collection(
    firestore,
    GROUPS_COLLECTION,
    groupId,
    INVITES_COLLECTION
  ) as CollectionReference<WithId<GroupMembershipInvite>>;

  return useFirestoreCollectionData(collectionRef, {
    idField: 'id',
  });
}
