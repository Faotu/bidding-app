import React, { useMemo } from 'react';
import Link from 'next/link';
import ProfileAvatar from '~/components/ProfileAvatar';
import { UserData } from '~/core/session/types/user-data';
import InviteToRolePlay from '~/components/players/schedule/InviteToRolePlay';
import { useGetEvents } from '~/lib/players/hooks/use-get-events';
import {
  BriefcaseIcon,
  ChartBarSquareIcon,
  ClockIcon,
  GlobeAltIcon,
  LanguageIcon,
  PresentationChartLineIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

interface PlayerTileProps {
  player: UserData;
}

const PlayerTile: React.FC<PlayerTileProps> = (props) => {
  const { player } = props;

  const { data, status } = useGetEvents(player.userId);

  // collect all the player events JSON data
  const playerEvents = useMemo(() => {
    return data?.docs?.map((doc) => doc.data()) ?? [];
  }, [data]);

  return (
    <>
      <div className="col-span-full rounded-2xl border border-gray-200 bg-gray-50/20 shadow-lg dark:border-gray-700 dark:bg-black-300/30 sm:col-span-6 xl:col-span-4">
        <div className="flex h-full flex-col">
          {/* Card top */}
          <div className="grow p-5">
            <div className="flex items-start justify-between">
              {/* Image + name */}
              <header>
                <div className="mb-2 flex">
                  <div className={'mr-5'}>
                    <ProfileAvatar
                      className={'h-[50px] w-[50px]'}
                      user={
                        {
                          displayName: player?.displayName,
                          email: player?.displayName,
                          uid: player?.userId,
                        } as any
                      }
                    />
                  </div>
                  <div className="mt-1 pr-1">
                    <h2 className="justify-center text-ellipsis text-[17px] font-semibold leading-snug">
                      {player?.displayName}
                    </h2>
                    <div className="flex items-center text-slate-800 dark:text-slate-300">
                      <GlobeAltIcon className={'mr-[5px] w-[15px]'} />
                      <span className={'text-sm'}>{player?.timezone}</span>
                    </div>
                  </div>
                </div>
              </header>
            </div>

            <div className="mt-2">
              <div className="text-sm">
                <div className={'mb-[10px]'}>
                  <div className={'flex font-bold text-slate-800 dark:text-slate-300'}>
                    <LanguageIcon className={'mr-[5px] w-[15px]'} />
                    <span>Fluent In</span>
                  </div>
                  <span>{player?.languagesFluentIn?.toString()}</span>
                </div>

                <div className={'mb-[10px]'}>
                  <div className={'flex font-bold text-slate-800 dark:text-slate-300'}>
                    <ClockIcon className={'mr-[5px] w-[15px]'} />
                    <span>Preferred Duration</span>
                  </div>
                  <span className={'text-sky-500'}>
                    {player?.preferredRolePlayDuration}
                  </span>
                </div>

                <div className={'mb-[10px]'}>
                  <div className={'flex font-bold text-slate-800 dark:text-slate-300'}>
                    <BriefcaseIcon className={'mr-[5px] w-[15px]'} />
                    <span>Years In Industry</span>
                  </div>
                  <span className={'text-emerald-500'}>
                    {player?.yearsOfIndustryExperience}
                  </span>
                </div>

                <div>
                  <div className={'flex font-bold text-slate-800 dark:text-slate-300'}>
                    <PresentationChartLineIcon
                      className={'mr-[5px] w-[15px]'}
                    />
                    <span>Years of Role Play Experience</span>
                  </div>
                  <span>{player?.yearsOfRolePlayExperience}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="block flex-1 px-3 py-4 text-center text-sm font-medium text-indigo-500 hover:text-indigo-600">
              <div className="flex items-center justify-center">
                <UserPlusIcon className={'w-[20px]'} />
                <span className={'ml-[10px]'}>
                  <InviteToRolePlay
                    player={player}
                    playerEvents={playerEvents}
                    customButton={<button>Invite to Role Play</button>}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerTile;
