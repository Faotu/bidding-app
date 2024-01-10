import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

const GroupsSettingsPageContainer = dynamic(
  () => import('~/components/groups/settings/GroupsSettingsPageContainer'),
  {
    ssr: false,
  }
);

const pageTitles: Record<string, string> = {
  'my-groups': 'My Groups',
  public: 'Public Groups',
};

const GroupsSettings: React.FC = () => {
  const {
    query: { id },
  } = useRouter();
  const groupid = id as string;
  return (
    <RouteShell title="Group Settings">
      <GroupsSettingsPageContainer id={groupid ?? ''} />
    </RouteShell>
  );
};

export default GroupsSettings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
