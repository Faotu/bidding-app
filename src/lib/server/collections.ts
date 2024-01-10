import type {
  CollectionReference,
  CollectionGroup,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

import { Organization } from '~/lib/organizations/types/organization';
import { UserData } from '~/core/session/types/user-data';
import { MembershipInvite } from '~/lib/organizations/types/membership-invite';

import {
  ORGANIZATIONS_COLLECTION,
  USERS_COLLECTION,
  INVITES_COLLECTION,
  GROUPS_COLLECTION,
  SCHEDULES_COLLECTION,
  GROUPS_INVITE_COLLECTION
} from '~/lib/firestore-collections';

import getRestFirestore from '~/core/firebase/admin/get-rest-firestore';
import { Group, Schedule } from '../groups/types/group';
import { GroupMembershipInvite } from '../groups/types/membership-invite';

export const dateToStringConverter = {
  toFirestore: function (data: any) {
    // Convert all Date fields to strings
    let transformed = { ...data };
    for (let field in transformed) {
      if (transformed[field] instanceof Date) {
        transformed[field] = transformed[field].toISOString();
      }
    }
    return transformed;
  },
  fromFirestore: function (snapshot: QueryDocumentSnapshot) {
    const data = snapshot.data();
    let transformed = { ...data };
    for (let field in transformed) {
      if (
        typeof transformed[field] === 'string' &&
        transformed[field].match(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        )
      ) {
        transformed[field] = new Date(transformed[field]);
      }
    }
    return transformed;
  },
};

export function getUsersCollection() {
  return (
    getCollectionByName(USERS_COLLECTION) as CollectionReference<UserData>
  ).withConverter(dateToStringConverter);
}

export function getOrganizationsCollection() {
  return getCollectionByName(
    ORGANIZATIONS_COLLECTION
  ) as CollectionReference<Organization>;
}

export function getInvitesCollection() {
  return getCollectionGroupByName(
    INVITES_COLLECTION
  ) as CollectionGroup<MembershipInvite>;
}

function getCollectionByName(collection: string) {
  return getRestFirestore().collection(collection);
}

function getCollectionGroupByName(collection: string) {
  return getRestFirestore().collectionGroup(collection);
}

export function getGroupsCollection() {
  return getCollectionByName(GROUPS_COLLECTION) as CollectionReference<Group>;
}

export function getScheduleCollection() {
  return getCollectionByName(
    GROUPS_COLLECTION
  ) as CollectionReference<Schedule>;
}

export function getGroupInvitesCollection() {
  return getCollectionGroupByName(
    GROUPS_INVITE_COLLECTION
  ) as CollectionGroup<GroupMembershipInvite>;
}
