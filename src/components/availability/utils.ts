import { DayData } from "~/core/session/types/user-data";

export const availabilityDayLabels = {
  saturday: "Saturday",
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export const initialDayData: DayData = {
  isActive: true,
  schedules: [{
    from: "09:00am",
    to: "05:00pm",
  }],
};

export function generateTimeList(): string[] {
  const times: string[] = [];

  for (let hour = 0; hour <= 11; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = (hour === 0 ? 12 : hour).toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const ampm = 'am';

      const time = `${formattedHour}:${formattedMinute}${ampm}`;
      times.push(time);
    }
  }

  for (let hour = 0; hour <= 11; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = (hour === 0 ? 12 : hour).toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const ampm = 'pm';

      const time = `${formattedHour}:${formattedMinute}${ampm}`;
      times.push(time);
    }
  }

  return times;
}

export function getNextHour(time: string): string {
  // Convert time to 24-hour format
  let time24 = convertTo24HourFormat(time);

  // Parse hours and minutes from the time
  let [hours, minutes] = time24.split(':').map(Number);

  // Calculate the next hour
  hours = (hours + 1) % 24;

  // Convert hours back to 12-hour format
  let [formattedHours, period] = convertTo12HourFormat(hours);

  // Add leading zeros to minutes if necessary
  minutes = (minutes as any).toString().padStart(2, '0');

  // Return the formatted time
  return `${formattedHours}:${minutes}${period}`;
}

export function convertTo24HourFormat(time: string): string {
  const matchResult = time.match(/(\d+):(\d+)(am|pm)/i);
  if (matchResult === null) {
    return '00:00'; // Return a default/fallback value
  }

  let [hours, minutes, period] = matchResult.slice(1);

  if (period.toLowerCase() === 'pm' && hours !== '12') {
    hours = (parseInt(hours) + 12).toString().padStart(2, '0');
  } else if (period.toLowerCase() === 'am' && hours === '12') {
    hours = '00';
  } else {
    hours = hours.padStart(2, '0');
  }

  return `${hours}:${minutes}`;
}

export function convertTo12HourFormat(hours: number): [string, string] {
  let formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  let period = hours < 12 ? 'am' : 'pm';
  return [formattedHours, period];
}

export function validateRangeSelection(fromTime: string, toTime: string): boolean {
  // Convert from time to 24-hour format
  let fromTime24 = convertTo24HourFormat(fromTime);

  // Convert to time to 24-hour format
  let toTime24 = convertTo24HourFormat(toTime);

  // Compare the two times
  return (fromTime24 < toTime24) || (fromTime24 > toTime24 && toTime24 === "00:00");
}

export function validateTimeOverlaps(fromTime: string | undefined, toTime: string | undefined, selectedTime: string | undefined, checkEquality: boolean) {

  if(!fromTime || !toTime || !selectedTime) {
    return false;
  }

  // Convert the times to 24-hour format
  let fromTime24 = convertTo24HourFormat(fromTime);
  let toTime24 = convertTo24HourFormat(toTime);
  let selectedTime24 = convertTo24HourFormat(selectedTime);

  // Check if the selected time is within the range
  if (checkEquality && selectedTime24 === fromTime24) {
    return false;
  } else if (selectedTime24 > fromTime24 && selectedTime24 < toTime24) {
    return false;
  } else if(selectedTime24 > fromTime24 && toTime24 === "00:00") {
    return false;
  } else {
    return true;
  }
}

export const timezones = [
  {
    value: "Pacific/Midway",
    label: "Pacific/Midway (GMT-11:00)"
  },
  {
    value: "Pacific/Honolulu",
    label: "Pacific/Honolulu (GMT-10:00)"
  },
  {
    value: "Pacific/Gambier",
    label: "Pacific/Gambier (GMT-9:00)"
  },
  {
    value: "America/Anchorage",
    label: "America/Anchorage (GMT-8:00)"
  },
  {
    value: "America/Los_Angeles",
    label: "America/Los_Angeles (GMT-7:00)"
  },
  {
    value: "America/Denver",
    label: "America/Denver (GMT-6:00)"
  },
  {
    value: "America/Chicago",
    label: "America/Chicago (GMT-5:00)"
  },
  {
    value: "America/New_York",
    label: "America/New_York (GMT-4:00)"
  },
  {
    value: "America/Caracas",
    label: "America/Caracas (GMT-4:00)"
  },
  {
    value: "America/Halifax",
    label: "America/Halifax (GMT-3:00)"
  },
  {
    value: "America/St_Johns",
    label: "America/St_Johns (GMT-2:30)"
  },
  {
    value: "America/Sao_Paulo",
    label: "America/Sao_Paulo (GMT-3:00)"
  },
  {
    value: "America/Argentina/Buenos_Aires",
    label: "America/Argentina/Buenos_Aires (GMT-3:00)"
  },
  {
    value: "America/Godthab",
    label: "America/Godthab (GMT-2:00)"
  },
  {
    value: "Atlantic/South_Georgia",
    label: "Atlantic/South_Georgia (GMT-2:00)"
  },
  {
    value: "Atlantic/Azores",
    label: "Atlantic/Azores (GMT-1:00)"
  },
  {
    value: "Africa/Casablanca",
    label: "Africa/Casablanca (GMT+1:00)"
  },
  {
    value: "Europe/London",
    label: "Europe/London (GMT+1:00)"
  },
  {
    value: "Europe/Paris",
    label: "Europe/Paris (GMT+2:00)"
  },
  {
    value: "Europe/Istanbul",
    label: "Europe/Istanbul (GMT+3:00)"
  },
  {
    value: "Europe/Moscow",
    label: "Europe/Moscow (GMT+3:00)"
  },
  {
    value: "Asia/Dubai",
    label: "Asia/Dubai (GMT+4:00)"
  },
  {
    value: "Asia/Tashkent",
    label: "Asia/Tashkent (GMT+5:00)"
  },
  {
    value: "Asia/Dhaka",
    label: "Asia/Dhaka (GMT+6:00)"
  },
  {
    value: "Asia/Bangkok",
    label: "Asia/Bangkok (GMT+7:00)"
  },
  {
    value: "Asia/Singapore",
    label: "Asia/Singapore (GMT+8:00)"
  },
  {
    value: "Asia/Tokyo",
    label: "Asia/Tokyo (GMT+9:00)"
  },
  {
    value: "Australia/Sydney",
    label: "Australia/Sydney (GMT+10:00)"
  },
  {
    value: "Pacific/Noumea",
    label: "Pacific/Noumea (GMT+11:00)"
  },
  {
    value: "Pacific/Auckland",
    label: "Pacific/Auckland (GMT+12:00)"
  },
  {
    value: "Pacific/Fiji",
    label: "Pacific/Fiji (GMT+12:00)"
  }
];
