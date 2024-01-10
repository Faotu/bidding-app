import React, { useState } from 'react';
import { UserData } from '~/core/session/types/user-data';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/core/ui/Sheet';
import { EventData } from '~/lib/players/types/event';
import SetupMeetingContent from './SetupMeetingContent';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const InviteToRolePlay = ({
  player,
  playerEvents,
  customButton,
}: {
  player: UserData;
  playerEvents: EventData[];
  customButton?: React.ReactNode,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(isOpen) => {
        setSheetOpen(isOpen);
      }}
    >
      <SheetTrigger asChild>
        {customButton ? customButton : (
          <button className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-white">
            <UserPlusIcon />
            Invite to Role Play
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-auto bg-white dark:bg-black-400">
        <SheetHeader>
          <SheetTitle>Invite to Role Play</SheetTitle>
          <SheetDescription>
            You are inviting {player.displayName} to a role play session.
          </SheetDescription>
        </SheetHeader>
        <SetupMeetingContent
          player={player}
          playerEvents={playerEvents}
          onScheduleMeeting={() => {
            setSheetOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default InviteToRolePlay;
