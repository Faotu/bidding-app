import { GetServerSidePropsContext } from 'next';
import { Trans } from 'next-i18next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { UserPlusIcon } from '@heroicons/react/24/outline';

import { withAppProps } from '~/lib/props/with-app-props';

import GroupSettingsTabs from '~/components/groups/GroupSettingsTabs';

import Button from '~/core/ui/Button';

import SettingsContentContainer from '~/components/settings/SettingsContentContainer';
import SettingsTile from '~/components/settings/SettingsTile';

import { useRouter } from 'next/router';
import RouteShell from '~/components/RouteShell';

const GroupMembersList = dynamic(
  () => import('~/components/groups/GroupMembersList'),
  {
    ssr: false,
  }
);

const GroupInvitedMembersList = dynamic(
  () => import('~/components/groups/invites/GroupInvitedMembersList'),
  {
    ssr: false,
  }
);

const GroupMembersPage: React.FCC = () => {
  const {
    query: { id },
  } = useRouter();
  const groupId = id as string;
  return (
    <RouteShell title="Group Members">
      <div
        className={`flex flex-col space-y-4 md:space-y-0 lg:mt-8 lg:flex-row lg:space-x-16 xl:space-x-24`}
      >
        <Head>
          <title key="title">Group Members</title>
        </Head>

        <GroupSettingsTabs groupId={groupId} />

        <SettingsContentContainer>
          <div className={'my-4 flex justify-end'}>
            <InviteMembersButton groupId={groupId} />
          </div>

          <div className="flex flex-1 flex-col space-y-6">
            <SettingsTile
              heading={<Trans i18nKey={'group:membersTabLabel'} />}
              subHeading={<Trans i18nKey={'group:membersTabSubheading'} />}
            >
              <GroupMembersList groupId={groupId} />
            </SettingsTile>

            <SettingsTile
              heading={<Trans i18nKey={'group:pendingInvitesHeading'} />}
              subHeading={<Trans i18nKey={'group:pendingInvitesSubheading'} />}
            >
              <GroupInvitedMembersList groupId={groupId} />
            </SettingsTile>
          </div>
        </SettingsContentContainer>
      </div>
    </RouteShell>
  );
};

export default GroupMembersPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return withAppProps(ctx);
}

function InviteMembersButton({ groupId }: { groupId: string }) {
  return (
    <Button
      className={'w-full lg:w-auto'}
      data-cy={'invite-form-link'}
      type="button"
      href={`/group/${groupId}/members/invite`}
    >
      <span className="flex items-center space-x-2">
        <UserPlusIcon className="h-5" />

        <span>
          <Trans i18nKey={'group:inviteMembersButtonLabel'} />
        </span>
      </span>
    </Button>
  );
}
