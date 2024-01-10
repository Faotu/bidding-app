import { SCHEDULES_COLLECTION } from '../firestore-collections';
import {
  getGroupsCollection,
  getOrganizationsCollection,
  getScheduleCollection,
  getUsersCollection,
} from './collections';

/**
 * @name getOrganizationById
 * @description Returns the Firestore reference of the organization by its ID
 * {@link organizationId}
 * @param organizationId
 */
export async function getOrganizationById(organizationId: string) {
  const organizations = getOrganizationsCollection();

  return organizations.doc(organizationId).get();
}

/**
 * @name getUserRefById
 * @description Returns the Firestore reference of the user by its ID {@link userId}
 * @param userId
 */
export async function getUserRefById(userId: string) {
  const users = getUsersCollection();

  return users.doc(userId).get();
}

/**
 * @description Fetch user Firestore object data (not auth!) by ID {@link userId}
 * @param userId
 */
export async function getUserData(userId: string) {
  const user = await getUserRefById(userId);
  const data = user.data();
  if (data) {
    return {
      ...data,
      id: user.id,
      dateOfBirth:
        data.dateOfBirth && data.dateOfBirth.toDate
          ? data.dateOfBirth.toDate().toString()
          : data.dateOfBirth.toString(),
      createdAt: data.createdAt.toString(),
      updatedAt: data.updatedAt.toString(),
    };
  }
}

// Groups & Schedules
/**
 * @name getGroupById
 * @description Returns the Firestore reference of the group by its ID
 * {@link groupId}
 * @param groupId
 */
export async function getGroupById(groupId: string) {
  const groups = getGroupsCollection();
  return groups.doc(groupId).get();
}

/**
 * @name getScheduledMeetingById
 * @description Returns the Firestore reference of the scheduled meeting by its ID
 * {@link scheduledMeetingId}
 * @param scheduledMeetingId
 */
export async function getScheduledMeetingById(
  groupId: string,
  scheduledMeetingId: string
) {
  const groupCollection = getGroupsCollection();
  return groupCollection
    .doc(groupId)
    .collection(SCHEDULES_COLLECTION)
    .doc(scheduledMeetingId)
    .get();
}
