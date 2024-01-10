import { GetServerSidePropsContext } from 'next';
import { withAppProps } from '~/lib/props/with-app-props';
import RouteShell from '~/components/RouteShell';
import DashboardContent from '~/components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <RouteShell title={'Dashboard'}>
      <DashboardContent />
    </RouteShell>
  );
};

export default Dashboard;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
