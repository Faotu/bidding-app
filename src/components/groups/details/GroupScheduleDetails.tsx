import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  Cog8ToothIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  LinkIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { Fragment, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import DateFormatter from '~/components/blog/DateFormatter';
import { calculateDuration, formatDate } from '~/core/generic/datetime-utils';
import { useUserId } from '~/core/hooks/use-user-id';
import { useUpdateGroupSchedule } from '~/lib/groups/hooks/schedules/use-update-group-schedule';
import { ModalState, Schedule } from '~/lib/groups/types/group';
import Button from '~/core/ui/Button';

const GroupScheduleDetails: React.FCC<{
  schedule: WithId<Schedule>;
  isOwner?: boolean;
  isMember?: boolean;
  handleButtonClick: (action: ModalState, schedule: Schedule) => unknown;
}> = ({ schedule, isOwner, isMember, handleButtonClick }) => {
  const userId = useUserId();
  const [updateGroupSchedule] = useUpdateGroupSchedule(schedule.groupId);
  const { t } = useTranslation('group');
  console.log('schedule', schedule);
  const { topic, attendees, startTime, endTime, description } = schedule;
  const [durationInHours, remainingMinutes] = useMemo(
    () =>
      startTime && endTime ? calculateDuration(startTime, endTime) : [0, 0],
    [startTime, endTime]
  );
  const shortDescription = useMemo(
    () =>
      description.length > 100
        ? description.slice(0, 100) + '...'
        : description,
    [description]
  );
  const isAttendee = useMemo(
    () => isMember && userId && attendees?.includes(userId),
    [isMember, attendees, userId]
  );
  const handleRsvp = useCallback(async () => {
    let attendees = schedule.attendees || [];
    if (!isAttendee && userId) {
      attendees?.push(userId);
    } else {
      attendees = attendees.filter((value) => value !== userId);
    }
    const scheduleUpdate = {
      id: schedule.id,
      groupId: schedule.groupId,
      attendees,
    };
    await toast.promise(updateGroupSchedule(scheduleUpdate), {
      success: t(`group:updateGroupScheduleSuccess`),
      error: t(`group:updateGroupScheduleError`),
      loading: t(`group:updateGroupScheduleLoading`),
    });
  }, [schedule, userId, updateGroupSchedule, isAttendee, t]);
  if (userId) {
    return (
      <li
        key={schedule.id}
        className="group flex items-center space-x-4 px-6 py-4 focus-within:bg-gray-100 hover:bg-gray-100"
      >
        <div className="flex-auto">
          <h3 className="pr-10 text-lg font-semibold text-gray-900 xl:pr-0">
            {schedule.topic}
          </h3>
          <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
            <div className="flex items-start space-x-2">
              <dt className="mt-0.5">
                <span className="sr-only">Date</span>
                <CalendarDaysIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd>
                <DateFormatter
                  dateString={schedule.startTime.toISOString()}
                  dateFormat="PP"
                />{' '}
                at{' '}
                <DateFormatter
                  dateString={schedule.startTime.toISOString()}
                  dateFormat="p"
                />
              </dd>
            </div>
            <div className="mt-2 flex items-start space-x-2 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
              <dt className="mt-0.5">
                <span className="sr-only">Duration</span>
                <ClockIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd>
                {durationInHours || remainingMinutes ? (
                  <>
                    {durationInHours > 0 ? `${durationInHours}hr` : null}
                    {durationInHours > 0 && remainingMinutes > 0 ? (
                      <span>:</span>
                    ) : null}
                    {remainingMinutes > 0 ? `${remainingMinutes}min(s)` : null}
                  </>
                ) : null}
              </dd>
            </div>
          </dl>
          <dl>
            <dt className="sr-only">{attendees?.length ?? 0} attendees</dt>
            <dd className="mt-2 flex gap-2 text-sm">
              <UserGroupIcon
                className="mr-0.5 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {attendees?.length ?? 0} Attendees
            </dd>
          </dl>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="transparent"
            onClick={() => handleRsvp()}
          >
            {isAttendee ? (
              <ArrowLeftOnRectangleIcon className="mr-1 h-5 w-5 text-rose-400" />
            ) : (
              <ArrowRightOnRectangleIcon className="mr-1 h-5 w-5 text-blue-400" />
            )}
            {isAttendee ? 'Decline' : 'RSVP'}
          </Button>
          {isAttendee ? (
            <Menu
              as="div"
              className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
              <div>
                <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="h-6 w-6 rotate-90"
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
                          href="#"
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() => handleButtonClick('view', schedule)}
                        >
                          View details
                        </a>
                      )}
                    </Menu.Item>
                    {isOwner ? (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() =>
                                handleButtonClick('edit', schedule)
                              }
                            >
                              Edit
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() =>
                                handleButtonClick('delete', schedule)
                              }
                            >
                              Delete
                            </a>
                          )}
                        </Menu.Item>
                      </>
                    ) : null}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : null}
        </div>
      </li>
    );
  }
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="display mb-2 text-xl font-semibold text-gray-800">
        {topic}
      </h3>
      <div className="mb-2 flex items-center space-x-2 text-sm text-gray-600">
        {durationInHours || remainingMinutes ? (
          <>
            <ClockIcon className="h-5 w-5" />
            <span>
              {durationInHours > 0 ? `${durationInHours}hr` : null}
              {durationInHours > 0 && remainingMinutes > 0 ? (
                <span>:</span>
              ) : null}
              {remainingMinutes > 0 ? `${remainingMinutes}min(s)` : null}
            </span>
          </>
        ) : null}
        <span className="mx-1">•</span>
        <UserGroupIcon className="h-5 w-5" />
        <span>{attendees?.length ?? 0} attendees</span>
      </div>
      <p className="mb-2 text-gray-700">{shortDescription}</p>
      <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600">
        <CalendarIcon className="h-5 w-5" />
        <span>{formatDate(startTime)}</span>
      </div>
      <div className="flex items-center space-x-3">
        {!isAttendee ? (
          <button
            className="flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-xs text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            onClick={() => handleRsvp()}
          >
            <ArrowRightOnRectangleIcon className="mr-2 h-6 w-6" />
            RSVP
          </button>
        ) : (
          <>
            <button
              className="flex items-center justify-center rounded-md border border-blue-600 px-4 py-2 text-xs text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
              onClick={() => handleButtonClick('view', schedule)}
            >
              <EyeIcon className="mr-1 h-5 w-5" />
              <span>View details</span>
            </button>
            <button
              className="flex items-center justify-center rounded-md border border-red-600 px-4 py-2 text-xs text-red-600 transition-colors hover:bg-red-600 hover:text-white"
              onClick={() => handleRsvp()}
            >
              <Cog8ToothIcon className="mr-1 h-5 w-5" />
              <span>Decline</span>
            </button>
          </>
        )}
      </div>
      {isOwner ? (
        <div className="mt-3 flex items-center space-x-3">
          <button
            className="flex items-center justify-center rounded-md border border-gray-600 px-4 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-600 hover:text-white"
            onClick={() => handleButtonClick('edit', schedule)}
          >
            <Cog8ToothIcon className="mr-1 h-5 w-5" />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center justify-center rounded-md border border-red-600 px-4 py-2 text-xs text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            onClick={() => handleButtonClick('delete', schedule)}
          >
            <Cog8ToothIcon className="mr-1 h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default GroupScheduleDetails;
