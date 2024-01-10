import { DocumentSnapshot } from 'firebase/firestore';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePagination } from '~/core/hooks/use-pagination';
import useFetchPlayers from '~/lib/user/hooks/use-fetch-players';
import Pagination from '../Pagination';
import PlayersTable from './PlayersTable';
import PlayersTableItem from './PlayersTableItem';
import SidebarFilter from './SidebarFilter';
import { FunnelIcon } from '@heroicons/react/20/solid';
import {
  genderOptions,
  languageOptions,
  personalityOptions,
  timezoneOptions,
  yearsOfExperienceOptions,
} from '~/core/generic/fieldOptions';
import useFetchPlayersCount from '~/lib/user/hooks/use-fetch-players-count';
import PlayerTile from "~/components/players/PlayerTile";

const PlayersPageContainer: React.FCC = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const cursors = useRef<Map<number, DocumentSnapshot>>(new Map());
  const prevFilters = useRef<Record<string, string[]>>(filters);
  const fetchPlayersCount = useFetchPlayersCount();
  const [playersCount, setPlayersCount] = useState<number>(0);
  const { page, setPage, itemsPerPage } = usePagination({ itemsPerPage: 50 });
  const { data, status } = useFetchPlayers({
    itemsPerPage,
    cursor: cursors.current.get(page),
    filters,
  });
  useEffect(() => {
    if (prevFilters.current !== filters) {
      setPage(1);
      prevFilters.current = filters;
    }
  }, [filters, setPage]);

  useEffect(() => {
    // when the component mounts, we store the players count in the state
    fetchPlayersCount().then((result) => {
      setPlayersCount(result.data().count);
    });
  }, [fetchPlayersCount]);

  // collect all the players JSON data
  const players = useMemo(() => {
    return data?.docs?.map((doc) => doc.data()) ?? [];
  }, [data]);

  // callback called when changing page
  const onPageChanged = useCallback(
    (nextPage: number) => {
      cursors.current.set(page + 1, data.docs[data.docs.length - 1]);
      setPage(nextPage);
    },
    [data, page, setPage]
  );

  const handleFilterChange = useCallback(
    (newFilters: Record<string, string[]>) => {
      setFilters((prevState) => ({
        ...prevState,
        ...newFilters,
      }));
    },
    []
  );

  const filterOptions = useMemo(
    () => [
      {
        id: 'gender',
        name: 'Gender',
        options: genderOptions,
      },
      {
        id: 'personalityType',
        name: 'Personality Type',
        options: personalityOptions,
      },
      {
        id: 'yearsOfIndustryExperience',
        name: 'Industry Experience',
        options: yearsOfExperienceOptions,
      },
      {
        id: 'yearsOfRolePlayExperience',
        name: 'Role Play Experience',
        options: yearsOfExperienceOptions,
      },
      {
        id: 'firstLanguage',
        name: 'First Language',
        type: 'dropdown',
        options: languageOptions,
      },
      {
        id: 'languagesFluentIn',
        name: 'Language',
        type: 'dropdown',
        options: languageOptions,
      },
      {
        id: 'timezone',
        name: 'Timezone',
        type: 'dropdown',
        options: timezoneOptions,
      },
    ],
    []
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Content area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <main>
          <div className="max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
            {/* Page header */}
            <div className="mb-4 sm:flex sm:items-center sm:justify-between">
              {/* Left: Title */}
              {/* Right: Actions */}
              <div className="grid grid-flow-col justify-start gap-2 sm:auto-cols-max sm:justify-end">
                {/* Date Selector */}

                {/* Filter button */}
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-10 lg:grid-cols-5">
              <SidebarFilter
                filters={filterOptions}
                handleChange={handleFilterChange}
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
              />
              <div className="lg:col-span-4">
                {/* Table */}
                {status === 'success' ? (
                  <>
                   {/* <PlayersTable>
                      {players.map((player) => (
                        <PlayersTableItem key={player.userId} player={player} />
                      ))}
                    </PlayersTable>*/}

                    <div className="grid grid-cols-12 gap-1">
                      {players.map((player) => (
                        <PlayerTile key={player.userId} player={player} />
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalCount={playersCount}
                pageChanged={onPageChanged}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlayersPageContainer;
