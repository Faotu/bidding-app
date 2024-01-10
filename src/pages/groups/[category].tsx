import dynamic from 'next/dynamic';
import RouteShell from '~/components/RouteShell';
import { withAppProps } from '~/lib/props/with-app-props';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const GroupsCategoryPageContainer = dynamic(
  () => import('~/components/groups/GroupsCategoryPageContainer'),
  {
    ssr: false,
  }
);

const pageTitles: Record<string, string> = {
  'my-groups': 'My Groups',
  public: 'Public Groups',
};

const GroupsCategory: React.FC = () => {
  const {
    query: { category },
  } = useRouter();
  const groupCategory = category as string;
  const pageTitle = useMemo(
    () => pageTitles[groupCategory] || pageTitles.public,
    [groupCategory]
  );
  return (
    <RouteShell title={pageTitle}>
      <GroupsCategoryPageContainer category={(category as string) ?? ''} />
    </RouteShell>
  );
};

export default GroupsCategory;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await withAppProps(ctx);
}
