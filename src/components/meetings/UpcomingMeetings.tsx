import { useUserId } from '~/core/hooks/use-user-id';
import LoadingMembersSpinner from '../groups/LoadingMembersSpinner';
import { Trans } from 'react-i18next';
import Alert from '~/core/ui/Alert';
import { useFetchEvents } from '~/lib/players/hooks/use-fetch-events';
import MeetingDetails from './MeetingDetails';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCallback, useMemo, useState } from 'react';
import { useUserSession } from '~/core/hooks/use-user-session';
import { Calendar } from '~/core/ui/Calendar';
import { AvailabilityDay } from '~/core/session/types/user-data';
import Button from '~/core/ui/Button';
import Link from 'next/link';
import { daysOfWeek } from '~/core/generic/datetime-utils';
import Heading from '~/core/ui/Heading';

const UpcomingMeetings = () => {
  const userId = useUserId() as string;
  const userSession = useUserSession();
  const user = userSession?.data;
  const { status, events, users } = useFetchEvents(userId);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const inactiveDays = useMemo(
    () =>
      !!user?.availability
        ? Object.keys(user.availability).reduce(
            (acc: string[], day: string) => {
              if (!user?.availability[day as AvailabilityDay].isActive) {
                acc.push(day);
              }
              return acc;
            },
            []
          )
        : [],
    [user?.availability]
  );

  const disableDayMatcher = useCallback(
    (day: Date) => {
      return inactiveDays.includes(daysOfWeek[day.getDay()]);
    },
    [inactiveDays]
  );

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
    <div className="px-6">
      <Heading type={4}>Upcoming Meetings</Heading>
      <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
        <div className="mt-4 md:pr-14">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => (!!date ? setSelectedDate(date) : null)}
            initialFocus
            classNames={{
              months: 'w-full',
              head_cell:
                'text-muted-foreground rounded-md flex-auto font-normal text-[0.8rem]',
              cell: 'flex-auto mx-0.5',
              day: 'xl:w-14 xl:h-14',
              day_selected: 'xl:w-14 xl:h-14',
            }}
            disabled={disableDayMatcher}
          />
        </div>
        <div className="mt-4 md:pl-14">
          <Link href="/settings/profile/availability">
            <Button variant="outline" block>
              Manage Availability
            </Button>
          </Link>
          <MeetingDetails
            selectedDate={selectedDate}
            events={events}
            users={users}
          />
        </div>
      </div>
    </div>
  );
};

export default UpcomingMeetings;
