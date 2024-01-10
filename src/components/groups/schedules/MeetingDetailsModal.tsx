import { useCallback, useMemo, useState } from 'react';
import Modal from '~/core/ui/Modal';
import {
  CalendarDaysIcon,
  ClockIcon,
  LinkIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Schedule } from '~/lib/groups/types/group';
import { calculateDuration, formatDate } from '~/core/generic/datetime-utils';
import { useFetchMeetingAttendeesMetadata } from '~/lib/groups/hooks/use-fetch-attendees-metadata';
import AttendeesList from './AttendeesList';
import Link from 'next/link';
import { User } from 'firebase/auth';
import DateFormatter from '~/components/blog/DateFormatter';

const MeetingDetailsModal = ({
  isOpen,
  setIsOpen,
  selectedSchedule,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  selectedSchedule: WithId<Schedule> | null;
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const {
    id,
    topic,
    attendees,
    startTime,
    endTime,
    location,
    description,
    groupId,
  } = selectedSchedule || {};
  const [durationInHours, remainingMinutes] = useMemo(
    () =>
      startTime && endTime ? calculateDuration(startTime, endTime) : [0, 0],
    [startTime, endTime]
  );
  const Heading = useMemo(
    () => <h3 className="display text-2xl font-bold">{topic}</h3>,
    [topic]
  );
  // fetch the metadata of all attendees from the admin
  // so that we can display name and profile picture
  const { data, loading, error } = useFetchMeetingAttendeesMetadata(
    groupId,
    id
  );
  const attendeesMetadata = data as unknown as User[];

  console.log('attendeesMetadata', attendeesMetadata);
  const pairs = useMemo(() => {
    const pairedAttendees = [];
    if (attendeesMetadata) {
      const sortedAttendees = [...attendeesMetadata].sort((a, b) =>
        a.uid.localeCompare(b.uid)
      );
      for (let i = 0; i < sortedAttendees.length; i += 2) {
        const pair = sortedAttendees.slice(i, i + 2);
        pairedAttendees.push(pair);
      }
    }
    return pairedAttendees;
  }, [attendeesMetadata]);

  const handleAccordionToggle = useCallback(() => {
    setIsAccordionOpen(!isAccordionOpen);
  }, [isAccordionOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="2xl" heading={Heading}>
      {selectedSchedule && (
        <>
          <div className="flex-auto">
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
                    dateString={startTime?.toISOString() || ''}
                    dateFormat="PPP"
                  />{' '}
                  at{' '}
                  <DateFormatter
                    dateString={startTime?.toISOString() || ''}
                    dateFormat="p"
                  />
                </dd>
              </div>
              <div className="mt-3 flex items-start space-x-2 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
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
                      {remainingMinutes > 0
                        ? `${remainingMinutes}min(s)`
                        : null}
                    </>
                  ) : null}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex justify-between">
              <dl className="text-gray-500">
                <dt className="sr-only">{attendees?.length ?? 0} attendees</dt>
                <dd className="mt-2 flex gap-2 text-sm">
                  <UserGroupIcon
                    className="mr-0.5 h-5 w-5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {attendees?.length ?? 0} Attendees
                </dd>
              </dl>
              <dl>
                <dt className="sr-only">Meeting Link</dt>
                <dd className="mt-2 text-sm">
                  <Link
                    className="flex items-center space-x-2 text-sm font-medium text-primary-500 hover:underline"
                    href={`https://meet.jit.si/schedule_${selectedSchedule.id}`}
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
          <p className="my-6 rounded-md bg-slate-50 p-2 text-gray-700">
            {description}
          </p>
          <div
            className={`mt-6 rounded-md border border-slate-200 bg-white p-4`}
          >
            <div className="relative flex cursor-pointer items-center justify-between">
              <h2 className="mb-0 font-semibold text-gray-800">
                <span
                  className="absolute inset-0"
                  onClick={handleAccordionToggle}
                ></span>
                Attendees ({attendees?.length ?? 0})
              </h2>
              <svg
                className={`h-5 w-5 transform fill-current transition-transform ${
                  isAccordionOpen ? 'rotate-180' : ''
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15a1 1 0 01-.71-.29l-4-4a1 1 0 111.42-1.42L10 12.59l3.29-3.3a1 1 0 111.42 1.42l-4 4A1 1 0 0110 15z" />
              </svg>
            </div>
            {isAccordionOpen && (
              <AttendeesList loading={loading} pairedAttendees={pairs} />
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
export default MeetingDetailsModal;
