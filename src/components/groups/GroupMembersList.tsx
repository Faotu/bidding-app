import { Trans } from 'next-i18next';

import If from '~/core/ui/If';
import Badge from '~/core/ui/Badge';

import { useFetchGroupData } from '~/lib/groups/hooks/use-fetch-group';
import { canInviteUsers } from '~/lib/groups/permissions';
import { useFetchGroupMembersMetadata } from '~/lib/groups/hooks/use-fetch-members-metadata';
import { Group, GroupMember } from '~/lib/groups/types/group';

import { useUserId } from '~/core/hooks/use-user-id';
import LoadingMembersSpinner from '~/components/groups/LoadingMembersSpinner';

// import GroupMembersActionsContainer from './GroupMembersActionsContainer';
import RoleBadge from './RoleBadge';
import ProfileAvatar from '../ProfileAvatar';
import Alert from '~/core/ui/Alert';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const GroupMembersList: React.FCC<{
  groupId: string;
}> = ({ groupId }) => {
  const userId = useUserId();
  const router = useRouter();

  // fetch the group members with an active listener
  // and re-render on changes
  const { data: group, status } = useFetchGroupData(groupId);

  const members = useMemo(
    () => getSortedMembers(group?.members),
    [group?.members]
  );

  // fetch the metadata from the admin
  // so that we can display email/name and profile picture
  const {
    data: membersMetadata,
    loading,
    error,
  } = useFetchGroupMembersMetadata(groupId);
  const isLoading = status === 'loading' || loading;

  if (isLoading) {
    return (
      <LoadingMembersSpinner>
        <Trans i18nKey={'group:loadingMembers'} />
      </LoadingMembersSpinner>
    );
  }

  if (status === 'error' || error) {
    return (
      <Alert type={'error'}>
        <Trans i18nKey={'group:loadMembersError'} />
      </Alert>
    );
  }

  if (!group) {
    router.replace('/404');
  }

  const currentUser = members.find((member) => member.id === userId);

  if (!currentUser) {
    return null;
  }

  const userRole = currentUser.role;

  return (
    <div className={'w-full space-y-10'}>
      <div className="flex flex-col divide-y divide-gray-100 dark:divide-black-400">
        {members.map(({ role, id: memberId }) => {
          const metadata = (membersMetadata as any)?.find((metadata: any) => {
            return metadata.uid === memberId;
          });

          if (!metadata) {
            return null;
          }

          const displayName = metadata.displayName
            ? metadata.displayName
            : metadata.email;

          const isCurrentUser = userId === metadata.uid;

          // check if user has the permissions to update another member of
          // the group. If it returns false, the actions' dropdown
          // should be disabled
            const shouldEnableActions = canInviteUsers(role);
          const key = `${metadata.uid}:${userRole}`;

          return (
            <div
              key={key}
              data-cy={'group-member'}
              className={
                'flex flex-col py-2 lg:flex-row lg:items-center lg:space-x-2' +
                ' justify-between space-y-2 lg:space-y-0'
              }
            >
              <div className={'flex flex-auto items-center space-x-4'}>
                <ProfileAvatar user={metadata} />

                <div className={'block truncate text-sm'}>{displayName}</div>

                <If condition={isCurrentUser}>
                  <Badge>
                    <Trans i18nKey={'group:youBadgeLabel'} />
                  </Badge>
                </If>
              </div>

              <div className={'flex items-center justify-end space-x-4'}>
                <div>
                  <RoleBadge role={role} />
                </div>

                {/* <GroupMembersActionsContainer
                  disabled={!shouldEnableActions}
                  targetMember={metadata}
                  targetMemberRole={role}
                  currentUserRole={userRole}
                /> */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupMembersList;

/**
 * @description Return the list of members sorted by role {@link MembershipRole}
 * @param group
 */
function getSortedMembers(members: Record<string, GroupMember> | undefined) {
  if (!members) return [];
  const membersIds = Object.keys(members);
  return membersIds
    .map((memberId) => {
      const role = members[memberId];
      return {
        id: memberId,
        role,
      };
    })
    .sort((prev, next) => {
      return next.role > prev.role ? 1 : -1;
    });
}
