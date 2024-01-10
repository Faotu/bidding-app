import { getAuth } from 'firebase-admin/auth';
import { ApiError } from 'next/dist/server/api-utils';

import { getScheduledMeetingById } from '../../queries';
import { HttpStatusCode } from '~/core/generic/http-status-code.enum';
import { Schedule } from '~/lib/groups/types/group';
/**
 * @name getOrganizationMembers
 * @description Returns the {@link UserInfo} object from the members of an organization
 */
export async function getScheduledMeetingAttendees({
  groupId,
  scheduledMeetingId,
  userId,
}: {
  scheduledMeetingId: string;
  groupId: string;
  userId: string;
}) {
  const auth = getAuth();
  const ref = await getScheduledMeetingById(groupId, scheduledMeetingId);
  const scheduledMeeting = ref.data() as Schedule;

  // forbid requests if the user is not an attendee to the scheduledMeeting
  const userIsAttendee = scheduledMeeting?.attendees?.includes(userId);

  if (!scheduledMeeting || !userIsAttendee || !scheduledMeeting.attendees) {
    throw new ApiError(HttpStatusCode.Forbidden, `Action Forbidden`);
  }

  const attendees = Object.values(scheduledMeeting.attendees);
  const data = attendees.map((uid) => auth.getUser(uid));

  return Promise.all(data);
}
