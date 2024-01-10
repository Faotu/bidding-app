import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Trans } from 'next-i18next';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

import { withAppProps } from '~/lib/props/with-app-props';

import InviteMembersForm from '~/components/groups/invites/InviteMembersForm';
import SettingsContentContainer from '~/components/settings/SettingsContentContainer';

import Button from '~/core/ui/Button';
import SettingsTile from '~/components/settings/SettingsTile';
import RouteShell from '~/components/RouteShell';
import GroupSettingsTabs from '~/components/groups/GroupSettingsTabs';
import { useRouter } from 'next/router';

const GroupMembersInvitePage: React.FCC = () => {
  const {
    query: { id },
  } = useRouter();
  const groupId = id as string;
  return (
    <RouteShell title="Group Members Invite">
      <div
        className={`flex flex-col space-y-4 md:space-y-0 lg:mt-8 lg:flex-row lg:space-x-16 xl:space-x-24`}
      >
        <Head>
          <title key="title">Invite Members</title>
        </Head>

        <GroupSettingsTabs groupId={groupId} />

        <SettingsContentContainer>
          <SettingsTile
            heading={<Trans i18nKey={'group:inviteMembersPageHeading'} />}
            subHeading={<Trans i18nKey={'group:inviteMembersPageSubheading'} />}
          >
            <InviteMembersForm groupId={groupId} />
          </SettingsTile>

          <div className={'mt-4'}>
            <GoBackToMembersButton groupId={groupId} />
          </div>
        </SettingsContentContainer>
      </div>
    </RouteShell>
  );
};

export default GroupMembersInvitePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}

function GoBackToMembersButton({ groupId }: { groupId: string }) {
  return (
    <Button
      size={'small'}
      color={'transparent'}
      href={`/group/${groupId}/members`}
    >
      <span className={'flex items-center space-x-1'}>
        <ArrowLeftIcon className={'h-3'} />

        <span>
          <Trans i18nKey={'organization:goBackToMembersPage'} />
        </span>
      </span>
    </Button>
  );
}
