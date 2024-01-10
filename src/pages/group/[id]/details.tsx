import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';

const GroupDetailsPageContainer = dynamic(
  () => import('~/components/groups/details/GroupDetailsPageContainer'),
  {
    ssr: false,
  }
);

const GroupDetails: React.FCC = () => {
  return (
    <RouteShell title="Group Details">
      <GroupDetailsPageContainer />
    </RouteShell>
  );
};

export default GroupDetails;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
