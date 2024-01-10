import dynamic from 'next/dynamic';

import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';
import ErrorBoundary from '~/core/ui/ErrorBoundary';

const PlayersPageContainer = dynamic(
  () => import('~/components/players/PlayersPageContainer'),
  {
    ssr: false,
  }
);

const Players = () => {
  return (
    <RouteShell title={'Players'}>
        <ErrorBoundary fallback={null}>
          <PlayersPageContainer />
        </ErrorBoundary>
    </RouteShell>
  );
};

export default Players;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
