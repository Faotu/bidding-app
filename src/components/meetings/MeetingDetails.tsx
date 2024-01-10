import { Fragment, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { EventData } from '~/lib/players/types/event';
import DateFormatter from '../blog/DateFormatter';
import { UserData } from '~/core/session/types/user-data';
import {
  ClockIcon,
  EllipsisVerticalIcon,
  LinkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCancelEvent } from '~/lib/players/hooks/use-cancel-event';
import toaster from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUserId } from '~/core/hooks/use-user-id';
import Heading from '~/core/ui/Heading';

interface MeetingDetailsProps {
  selectedDate: Date;
  events: WithId<EventData>[];
  users: Record<string, UserData>;
}

const MeetingDetails = ({
  selectedDate,
  events = [],
  users,
}: MeetingDetailsProps) => {
  const userId = useUserId();
  const { t } = useTranslation('event');
  const [isDeleting, setIsDeleting] = useState(false);

  const meetings = useMemo(() => {
    return events
      .filter(
        // add 1 hour to selectedDate
        (event) =>
          new Date(event.start).toISOString().split('T')[0] ===
          new Date(selectedDate.getTime() + 60 * 60 * 1000)
            .toISOString()
            .split('T')[0]
      )
      .sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
  }, [events, selectedDate]);

  const cancelEventRequest = useCancelEvent();

  const handleCancelMeeting = useCallback(
    (eventId: string) => {
      setIsDeleting(true);
      void (async () => {
        try {
          const promise = cancelEventRequest(eventId);

          await toaster.promise(promise, {
            success: t(`cancelEventSuccess`),
            error: t(`cancelEventError`),
            loading: t(`cancelEventLoading`),
          });

          setIsDeleting(false);
        } catch (e) {
          console.error(e);
          setIsDeleting(false);
        }
      })();
    },
    [cancelEventRequest, t]
  );

  console.log(meetings);
  return (
    <section className="mt-8">
      <Heading type={4}>
        Schedule for <DateFormatter dateString={selectedDate.toISOString()} />
      </Heading>
      {meetings.length > 0 ? (
        <ol className="mt-6 space-y-4 divide-y divide-gray-100 text-sm leading-6 text-gray-500 dark:text-gray-400">
          {meetings.map((meeting) => (
            <li
              key={meeting.id}
              className="group flex space-x-4 rounded-xl px-4 py-2 focus-within:bg-gray-100 hover:bg-gray-100 dark:focus-within:bg-black-300 dark:hover:bg-black-300"
            >
              <div className="flex-auto">
                <h3 className="pr-10 font-semibold text-gray-900 dark:text-gray-200 xl:pr-0">
                  {users[meeting.playerId as string]?.displayName}
                </h3>
                <dl className="mt-2 flex flex-col text-gray-500 dark:text-gray-400 xl:flex-row">
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
                      className="flex items-center space-x-2 text-sm font-medium text-primary-500 hover:underline"
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
              {userId && meeting.createdBy && meeting.createdBy === userId ? (
                <Menu
                  as="div"
                  className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
                >
                  <div>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisVerticalIcon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="ring-black absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              role="button"
                              href="#"
                              onClick={() => handleCancelMeeting(meeting.id)}
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900 dark:text-gray-200'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              Cancel
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-6 text-left text-gray-500 dark:text-gray-400">
          No meetings scheduled for this day.
        </div>
      )}
    </section>
  );
};

export default MeetingDetails;
