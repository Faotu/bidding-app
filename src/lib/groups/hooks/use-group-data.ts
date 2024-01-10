import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useUserId } from '~/core/hooks/use-user-id';
import { GroupMember, GroupSettings } from '../types/group';
import { useFetchGroupData } from './use-fetch-group';

export type GroupData = {
  groupId: string;
  isOwner: boolean;
  isMember: boolean;
  groupMembersAvatars?: any[];
  settings?: GroupSettings;
  members?: Record<string, GroupMember>;
};
function useGroupData(groupId: string): GroupData {
  const userId = useUserId();
  const router = useRouter();
  const { data: group, status } = useFetchGroupData(groupId);
  const isMember = useMemo(
    () =>
      group?.members && userId && Object.keys(group?.members).includes(userId),
    [group, userId]
  );
  useEffect(() => {
    if (status !== 'loading' && (!group || !isMember)) {
      router.replace('/groups');
    }
  }, [group, status, isMember, router]);

  const groupData = useMemo(() => {
    return {
      groupId: !!group ? group.groupId : '',
      isOwner: !!group?.ownerId && group.ownerId === userId,
      isMember: !!(group?.members && userId) && !!group.members[userId],
      settings: !!group?.settings ? group.settings : ({} as GroupSettings),
      members: !!group?.members
        ? group.members
        : ({} as Record<string, GroupMember>),
    };
  }, [group, userId]);

  return groupData;
}

export default useGroupData;
