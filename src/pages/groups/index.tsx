import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';

const GroupsPageContainer = dynamic(
  () => import('~/components/groups/GroupsPageContainer'),
  {
    ssr: false,
  }
);

const Groups = () => {
  return (
    <RouteShell title={'Groups'}>
      <GroupsPageContainer />
    </RouteShell>
  );
};

export default Groups;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
