import { FirebaseError } from 'firebase/app';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useRequestState } from '~/core/hooks/use-request-state';
import { Group, GroupMember } from '~/lib/groups/types/group';
import { GROUPS_COLLECTION } from '~/lib/firestore-collections';
import { useUserId } from '~/core/hooks/use-user-id';

/**
 * @name useUpdateGroup
 * @description Hook to update a group's information
 */
export function useUpdateGroup() {
  const { state, setError, setData, setLoading } =
    useRequestState<Partial<WithId<Group>>>();

  const firestore = useFirestore();

  const updateGroup = useCallback(
    async (group: WithId<Partial<Group>>) => {
      setLoading(true);
      try {
        const ref = doc(firestore, GROUPS_COLLECTION, group.id);
        await updateDoc(ref, group);
        setData(group);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setData, setError, setLoading]
  );

  const handleGroupMembership = useCallback(
    async (groupId: string, userId: string, membersList: Group['members']) => {
      setLoading(true);
      let members = membersList || {};
      const isMember = members && Object.keys(members).includes(userId);
      if (isMember) {
        const newMemberList: Group['members'] = {};
        Object.keys(members)
          .filter((memberId) => memberId !== userId)
          .forEach((memberId) => {
            newMemberList[memberId] = members[memberId];
          });
        members = newMemberList;
      } else {
        members = {
          ...members,
          [userId]: GroupMember.member,
        };
      }
      try {
        const data = {
          id: groupId,
          members,
        };
        const ref = doc(firestore, GROUPS_COLLECTION, groupId);
        await updateDoc(ref, data);
        setData(data);
      } catch (e) {
        setError((e as FirebaseError).message);
        throw e;
      }
    },
    [firestore, setData, setError, setLoading]
  );

  return [updateGroup, state, handleGroupMembership] as [
    typeof updateGroup,
    typeof state,
    typeof handleGroupMembership
  ];
}
