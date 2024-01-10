import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';

const MeetingsPageContainer = dynamic(
  () => import('~/components/meetings/MeetingsPageContainer'),
  {
    ssr: false,
  }
);

const Meetings = () => {
  return (
    <RouteShell title={'Meetings'}>
      <MeetingsPageContainer />
    </RouteShell>
  );
};

export default Meetings;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
