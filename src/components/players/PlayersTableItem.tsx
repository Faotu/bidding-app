import React, { useMemo } from 'react';
import { UserData } from '~/core/session/types/user-data';
import { useGetEvents } from '~/lib/players/hooks/use-get-events';
import LoadingMembersSpinner from '../organizations/LoadingMembersSpinner';
import { Trans } from 'next-i18next';
import Alert from '~/core/ui/Alert';
import InviteToRolePlay from './schedule/InviteToRolePlay';

const PlayersTableItem: React.FCC<{
  player: UserData;
}> = ({ player }) => {
  const { data, status } = useGetEvents(player.userId);

  // collect all the player events JSON data
  const playerEvents = useMemo(() => {
    return data?.docs?.map((doc) => doc.data()) ?? [];
  }, [data]);

  if (status === 'loading') {
    return (
      <tr>
        <td>
          <LoadingMembersSpinner>
            <Trans i18nKey={'organization:loadingPlayers'} />
          </LoadingMembersSpinner>
        </td>
      </tr>
    );
  }

  if (status === 'error') {
    return (
      <tr>
        <td>
          <Alert type={'error'}>
            <Trans i18nKey={'organization:loadPlayersError'} />
          </Alert>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-left">{player.displayName}</div>
        </td>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-left">{player.timezone}</div>
        </td>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-center">
            {player.languagesFluentIn?.toString()}
          </div>
        </td>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-left font-medium text-sky-500">
            {player.preferredRolePlayDuration}
          </div>
        </td>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-left font-medium text-emerald-500">
            {player.yearsOfIndustryExperience}
          </div>
        </td>
        <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5 dark:text-white">
          <div className="text-center">{player.yearsOfRolePlayExperience}</div>
        </td>
        <td className="w-px whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
          <InviteToRolePlay
            player={player}
            playerEvents={playerEvents}
          />
        </td>
      </tr>
    </>
  );
};

export default PlayersTableItem;
