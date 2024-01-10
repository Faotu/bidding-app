import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
// Types and Utils
import {
  Availability,
  AvailabilityDay,
  Schedule,
} from '~/core/session/types/user-data';

export const daysOfWeek: AvailabilityDay[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export const months: string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const locales = {
  'en-US': require('date-fns'),
};

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function formatDate(date: Date): string {
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${dayOfWeek}, ${month} ${day}, ${year} at ${hours12}:${formattedMinutes} ${amOrPm}`;
}

export function calculateDuration(
  startTime: Date,
  endTime: Date
): [hours: number, minutes: number] {
  const durationInMilliseconds: number =
    endTime.getTime() - startTime.getTime();
  const durationInSeconds: number = Math.floor(durationInMilliseconds / 1000);
  const durationInMinutes: number = Math.floor(durationInSeconds / 60);
  const durationInHours: number = Math.floor(durationInMinutes / 60);

  const remainingMinutes: number = durationInMinutes % 60;
  return [durationInHours, remainingMinutes];
}

export const getMinAndMaxTimes = (times: Date[][]): [Date, Date] => {
  const minTime = new Date(
    Math.min(...times.map((timeArray) => timeArray[0].getTime()))
  );
  const maxTime = new Date(
    Math.max(...times.map((timeArray) => timeArray[1].getTime()))
  );
  return [minTime, maxTime];
};

export const getDaysMinMaxTime = (
  availability: Availability
): Record<string, Date[]> => {
  const daysMinMaxTime: Record<string, Date[]> = {};
  daysOfWeek.forEach((day) => {
    const daySchedules = availability[day];
    if (!daySchedules) return;

    const schedules = daySchedules.schedules;
    const times = schedules.map((schedule: Schedule) => [
      parse(schedule.from, 'h:mmaa', new Date()),
      parse(schedule.to, 'h:mmaa', new Date()),
    ]);
    daysMinMaxTime[day] = getMinAndMaxTimes(times);
  });
  return daysMinMaxTime;
};
