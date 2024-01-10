import Heading from '~/core/ui/Heading';
import { useUserSession } from '~/core/hooks/use-user-session';
import { useFetchEvents } from '~/lib/players/hooks/use-fetch-events';
import { useUserId } from '~/core/hooks/use-user-id';
import { useMemo } from 'react';
import DateFormatter from '~/components/blog/DateFormatter';
import {
  CalendarDaysIcon,
  ClockIcon,
  LinkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface MeetingCardProps {
  date?: any;
  meetingData?: any;
  users?: any[];
}

const MeetingCard: React.FC<MeetingCardProps> = (props) => {
  const meeting = props?.meetingData;
  return (
    <>
      {/*<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </a>
            </div>*/}
      <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <div className="flex-auto">
          <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
            {props?.users
              ? props?.users[meeting.playerId as any]?.displayName
              : ''}
          </h3>
          <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
            <div className="flex items-start space-x-3">
              <dt className="mt-0.5">
                <span className="sr-only">Date</span>
                <ClockIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd>
                <DateFormatter
                  dateString={meeting.start.toString()}
                  dateFormat="hh:mm a"
                />{' '}
                -{' '}
                <DateFormatter
                  dateString={meeting.end.toString()}
                  dateFormat="hh:mm a"
                />
              </dd>
            </div>
            <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
              <dt className="mt-0.5">
                <span className="sr-only">Topic</span>
                <SparklesIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd>{meeting.title}</dd>
            </div>
          </dl>
          <dl>
            <dt className="sr-only">Meeting Link</dt>
            <dd className="mt-2 text-sm">
              <Link
                className="flex items-center space-x-2 text-sm font-medium text-primary-900 hover:underline"
                href={`https://meet.jit.si/${meeting.id}`}
                target="_blank"
              >
                <LinkIcon
                  className="mr-0.5 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                Join Meeting
              </Link>
            </dd>
          </dl>
        </div>
      </div>
    </>
  );
};

export default function DashboardContent() {
  const userId = useUserId() as string;
  const { events } = useFetchEvents(userId);

  // change to use useMemo
  const selectedDate = useMemo(() => {
    const date = new Date();
    return date;
  }, []);

  const nextWeek = useMemo(() => {
    const currentDate = new Date();
    const nextWeekDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // Add 7 days
    return nextWeekDate;
  }, []);

  const meetings = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.start);
        // Compare if the event is within the next week
        return eventDate >= selectedDate && eventDate <= nextWeek;
      })
      .sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
  }, [events, selectedDate, nextWeek]);

  return (
    <div className={'flex flex-col space-y-6 pb-36'}>
      <UserGreetings />

      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' +
          ' xl:grid-cols-4'
        }
      >
        {meetings.map((item, index) => (
          <MeetingCard key={index} meetingData={item} date={selectedDate} />
        ))}
      </div>

      {meetings?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-white p-[100px]">
          <div className={'w-[100px]'}>
            <CalendarDaysIcon className={'text-gray-600'} />
          </div>
          <p className="mt-4 text-center text-2xl font-semibold text-gray-600">
            No upcoming events over the next week
          </p>
        </div>
      )}

      {/* <Heading type={4}>Your groups</Heading>

      <div
        className={
          'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' +
          ' xl:grid-cols-4'
        }
      >
        {dummyCardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>*/}
    </div>
  );
}

function UserGreetings() {
  const user = useUserSession();
  const userDisplayName = user?.auth?.displayName ?? user?.auth?.email ?? '';

  return (
    <div>
      <Heading type={4}>Welcome Back, {userDisplayName}</Heading>

      <p className={'text-gray-500 dark:text-gray-400'}>
        <span>Here are your upcoming events</span>
      </p>
    </div>
  );
}
