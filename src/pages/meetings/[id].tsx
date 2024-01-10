import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';

const JitsiMeet = dynamic(() => import('~/components/jitsi/JitsiMeet'), {
  ssr: false,
});

const JoinMeeting = () => {
  return (
    <RouteShell title={'Join Meeting'}>
      <JitsiMeet />
    </RouteShell>
  );
};

export default JoinMeeting;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
