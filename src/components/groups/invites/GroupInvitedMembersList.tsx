import { Trans } from 'next-i18next';

import { useFetchInvitedMembers } from '~/lib/groups/hooks/use-fetch-invited-members';

import FallbackUserAvatar from '../../FallbackUserAvatar';
import RoleBadge from '../RoleBadge';
// import DeleteInviteButton from './DeleteInviteButton';

import { IfHasPermissions } from '~/components/IfHasPermissions';
import LoadingMembersSpinner from '~/components/organizations/LoadingMembersSpinner';
import Alert from '~/core/ui/Alert';

const GroupInvitedMembersList: React.FCC<{
  groupId: string;
}> = ({ groupId }) => {
  const { data: members, status } = useFetchInvitedMembers(groupId);

  if (status === 'loading') {
    return (
      <LoadingMembersSpinner>
        <Trans i18nKey={'group:loadingInvitedMembers'} />
      </LoadingMembersSpinner>
    );
  }

  if (status === 'error') {
    return (
      <Alert type={'error'}>
        <Trans i18nKey={'group:loadInvitedMembersError'} />
      </Alert>
    );
  }

  if (!members.length) {
    return (
      <p className={'text-sm'}>
        <Trans i18nKey={'group:noPendingInvites'} />
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100 dark:divide-black-400">
      {members.map(({ email, role, code, id }) => {
        return (
          <div
            key={id}
            data-cy={'invited-member'}
            data-code={code}
            className={
              'flex flex-col py-2 lg:flex-row lg:items-center lg:space-x-2'
            }
          >
            <div className={'flex flex-auto items-center space-x-4'}>
              <FallbackUserAvatar text={email} />

              <div className={'block truncate text-sm'}>{email}</div>
            </div>

            <div className={'flex items-center justify-end space-x-4'}>
              <RoleBadge role={role} />

              {/* <IfHasPermissions condition={canDeleteInvites}>
                <DeleteInviteButton
                  inviteId={id}
                  groupId={groupId}
                  memberEmail={email}
                />
              </IfHasPermissions> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupInvitedMembersList;
