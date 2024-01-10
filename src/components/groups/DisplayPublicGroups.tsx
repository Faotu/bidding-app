import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import Groups from './Groups';
import useFetchGroups from '~/lib/groups/hooks/use-fetch-groups';
import { usePagination } from '~/core/hooks/use-pagination';
import { DocumentSnapshot } from '@firebase/firestore';
import { useUserSession } from '~/core/hooks/use-user-session';
import GroupsHeader from './GroupsHeader';
import Pagination from '../Pagination';
import useFetchGroupsCount from '~/lib/groups/hooks/use-fetch-groups-count';
import { FilterType } from '~/core/firebase/types/query';

const DisplayPublicGroups: React.FC<{
  featured: boolean;
}> = ({ featured }) => {
  const user = useUserSession();
  const [filters, setFilters] = useState<FilterType[]>([
    {
      field: 'settings.isPublic',
      op: '==',
      value: true,
    },
  ]);
  const prevFilters = useRef<FilterType[]>(filters);
  const cursors = useRef<Map<number, DocumentSnapshot>>(new Map());
  const fetchGroupsCount = useFetchGroupsCount({ filters });
  const [groupsCount, setGroupsCount] = useState<number>(0);
  // display four items in featured display
  const { page, setPage, itemsPerPage } = usePagination({
    itemsPerPage: featured ? 4 : 10,
  });
  const { data, status } = useFetchGroups({
    itemsPerPage,
    cursor: cursors.current.get(page),
    filters,
  });
  useEffect(() => {
    // when the component mounts, we store the groups count in the state
    fetchGroupsCount().then((result) => {
      setGroupsCount(result.data().count);
    });
  }, [fetchGroupsCount]);

  useEffect(() => {
    if (prevFilters.current !== filters) {
      setPage(1);
      prevFilters.current = filters;
    }
  }, [filters, setPage]);

  // collect all the groups JSON data
  const groups = useMemo(() => {
    const results = data?.docs?.map((doc) => doc.data()) ?? [];
    const userId = user?.data?.userId;
    if (userId) return results.filter((doc) => !doc.members?.[userId]);
    return results;
  }, [data, user]);
  // callback called when changing page
  const onPageChanged = useCallback(
    (nextPage: number) => {
      cursors.current.set(page + 1, data.docs[data.docs.length - 1]);
      setPage(nextPage);
    },
    [data, page, setPage]
  );

  return (
    <>
      <GroupsHeader
        featured={featured}
        title="Public groups"
        showAllLink="/groups/public"
      />
    <section className="px-6">
        <Groups groups={groups} />
      </section>
      {/* Pagination */}
      {!featured ? (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalCount={groupsCount}
            pageChanged={onPageChanged}
            itemsPerPage={itemsPerPage}
          />
        </div>
      ) : null}
    </>
  );
};

export default DisplayPublicGroups;
