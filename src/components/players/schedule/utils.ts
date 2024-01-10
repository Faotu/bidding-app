import { parse } from 'date-fns';
// Types and Utils
import {
  Availability,
  AvailabilityDay,
  Schedule,
} from '~/core/session/types/user-data';
import { EventSlot, RolePlayTopic } from '~/lib/players/types/meeting';

export const availableTopics: RolePlayTopic[] = [
  {
    title: 'FSBO (For Sales By Owner)',
    description:
      'Calling people that are selling without an agent, usually 10 minutes per person role play.',
  },
  {
    title: 'Expired',
    description: 'Expired listings, about 10 minutes per person role play',
  },
  {
    title: 'Just Listed/Just Sold',
    description:
      'This is also called “circle prospecting”, calling around a specific geographic area, citing recent listings or sales, 10 minutes per person.',
  },
  {
    title: 'Sphere',
    description: 'People that know you, about 10 minutes per person.',
  },
  {
    title: 'Absentee Owner',
    description:
      'Investors that live out of the area where they have their investment property, about 10 minutes per person.',
  },
  {
    title: 'Investor',
    description:
      'Investors living in the same area where they invest, about 10 minutes per person.',
  },
  {
    title: 'Past Client',
    description: 'People you worked with in the past, 10 minutes per person.',
  },
  {
    title: 'Referral Request',
    description: 'People that you know, about 5 minutes per person.',
  },
  {
    title: 'Listing Presentation',
    description:
      'Role-play of a face-to-face presentation before signing the listing paperwork, about 20 to 30 minutes.',
  },
  {
    title: 'On-The-Phone Objections',
    description:
      'Role-playing objections you most often hear on the phone. Usually, it is a ping pong role play, about 30 minutes in total.',
  },
  {
    title: 'In-Person Objections',
    description:
      'Role-playing objections you most often hear in person. Usually, it is a ping pong role play, about 30 minutes in total.',
  },
  {
    title: 'On-The-Phone Closing',
    description:
      'Same as above, but for objections you most often hear in-person.',
  },
  {
    title: 'In-Person Closing',
    description:
      'Closing the call for an appointment, about 10 minutes per person.',
  },
  {
    title: 'Monthly Real Estate Update',
    description:
      'giving a market update to the people you know, about 10 minutes per person.',
  },
  {
    title: 'Buyer Presentation',
    description: '30 minute buyer presentation practice.',
  },
];

export const transformUnavailbilityToBlockedEvents = (
  startDate: Date,
  availability: Availability,
  selectedDay: AvailabilityDay,
  daysMinMaxTime: Record<string, Date[]>
): EventSlot[] => {
  const daySchedules = availability[selectedDay];
  if (!daySchedules) return [];

  const events: EventSlot[] = [];
  let currentTime = startDate || new Date();
  // set the hours to the day max and min time from daysMinMaxTime based on the currentTime day of the week
  currentTime.setHours(
    daysMinMaxTime[selectedDay][0].getHours(),
    daysMinMaxTime[selectedDay][0].getMinutes(),
    0,
    0
  );

  daySchedules.schedules.forEach((schedule: Schedule) => {
    const fromTime = parse(schedule.from, 'h:mmaa', currentTime);
    const toTime = parse(schedule.to, 'h:mmaa', currentTime);

    // If there's a gap between the current time and the next schedule, add an unavailable slot
    if (currentTime.getTime() !== fromTime.getTime()) {
      events.push({
        start: new Date(currentTime),
        end: new Date(fromTime),
        title: 'Unavailable',
        isUnavailable: true,
      });
    }
    // Move the current time to the end of this schedule
    currentTime = toTime;
  });
  return events;
};
