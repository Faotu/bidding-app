import { useCallback } from 'react';
import { useUser } from 'reactfire';

import { FirebaseError } from 'firebase/app';

import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';

import { useRequestState } from '~/core/hooks/use-request-state';
import { Group, GroupMember } from '~/lib/groups/types/group';

import { GROUPS_COLLECTION } from '~/lib/firestore-collections';

/**
 * @name useCreateGroup
 * @description Hook to create a new group
 */
export function useCreateGroup() {
  const user = useUser();
  const userId = user.data?.uid as string;

  const { state, setError, setData, setLoading } =
    useRequestState<WithId<Group>>();

  const createGroupCallback = useCallback(
    async (payload: { name: string; description: string }) => {
      const firestore = getFirestore();
      const batch = writeBatch(firestore);

      try {
        setLoading(true);

        const groups = collection(firestore, GROUPS_COLLECTION);
        const groupDoc = doc(groups);

        const groupData: Group = {
          ownerId: userId,
          settings: {
            ...payload,
            isPublic: false,
          },
          groupId: groupDoc.id,
          members: {
            [userId]: GroupMember.owner,
          },
        };

        batch.set(groupDoc, groupData);
        await batch.commit();
        setData({ ...groupData, id: groupDoc.id });
      } catch (e) {
        setError((e as FirebaseError).message);
        return Promise.reject(e);
      }
    },
    [setData, setError, setLoading, userId]
  );

  return [createGroupCallback, state] as [
    typeof createGroupCallback,
    typeof state
  ];
}
