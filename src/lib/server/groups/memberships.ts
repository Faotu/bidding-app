import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { ApiError } from 'next/dist/server/api-utils';

import { Group } from '~/lib/groups/types/group';

import { getGroupById, getUserRefById } from '../queries';

import {
  throwNotFoundException,
  throwUnauthorizedException,
} from '~/core/http-exceptions';

import { getGroupInvitesCollection } from '~/lib/server/collections';
import { GroupMembershipInvite } from '~/lib/groups/types/membership-invite';
import { HttpStatusCode } from '~/core/generic/http-status-code.enum';

/**
 * @name getGroupMembers
 * @description Returns the {@link UserInfo} object from the members of an group
 */
export async function getGroupMembers(params: {
  groupId: string;
  userId: string;
}) {
  const auth = getAuth();
  const ref = await getGroupById(params.groupId);
  const group = ref.data();

  // forbid requests if the user does not belong to the group
  const userIsMember = params.userId in (group?.members ?? {});

  if (!group || !userIsMember) {
    throw new ApiError(HttpStatusCode.Forbidden, `Action Forbidden`);
  }

  let data: Promise<UserRecord>[] = [];
  if (group.members) {
    const members = Object.keys(group.members);
    data = members.map((userId) => auth.getUser(userId));
  }

  return Promise.all(data);
}

// /**
//  * @name removeMemberFromGroup
//  * @description Remove a member with ID userId from an Group
//  * @param params
//  */
// export async function removeMemberFromGroup(params: {
//   groupId: string;
//   targetUserId: string;
//   currentUserId: string;
// }) {
//   const { targetUserId, currentUserId, groupId } = params;
//   const doc = await getGroupById(groupId);
//   const group = doc.data();

//   if (!group) {
//     throw throwNotFoundException();
//   }

//   assertUserCanUpdateMember({
//     group,
//     currentUserId,
//     targetUserId,
//   });

//   const memberPath = getMemberPath(targetUserId);

//   await doc.ref.update({
//     [memberPath]: FieldValue.delete(),
//   });
// }

// /**
//  * @name updateMemberRole
//  * @description Update the role of a member within an group
//  * @param params
//  */
// export async function updateMemberRole(params: {
//   groupId: string;
//   targetUserId: string;
//   currentUserId: string;
//   role: string;
// }) {
//   const { role, currentUserId, targetUserId, groupId } = params;
//   const doc = await getGroupById(groupId);
//   const group = doc.data();

//   if (!group) {
//     throw throwNotFoundException();
//   }

//   assertUserCanUpdateMember({
//     group,
//     currentUserId,
//     targetUserId,
//   });

//   const user = await getUserRefById(targetUserId);
//   const memberPath = getMemberPath(targetUserId);

//   await doc.ref.update({
//     [memberPath]: {
//       role,
//       user: user.ref,
//     },
//   });
// }

/**
 * @name acceptInviteToGroup
 * @description Add a member to an group by using the invite code
 */
export async function acceptInviteToGroup({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  const firestore = getFirestore();
  const auth = getAuth();
  const batch = firestore.batch();
  const inviteDoc = await getInviteByCode(code);

  if (!inviteDoc?.exists) {
    throw new ApiError(HttpStatusCode.NotFound, `Invite not found`);
  }

  const invite = inviteDoc.data();
  const currentTime = new Date().getTime();
  const isInviteExpired = currentTime > invite.expiresAt;

  if (isInviteExpired) {
    await inviteDoc.ref.delete();

    throw new Error(`Invite is expired`);
  }

  const groupId = invite.group.id;
  const role = invite.role;
  const userPath = `/users/${userId}`;

  const groupRef = firestore.doc(`/groups/${groupId}`);
  const userRef = firestore.doc(userPath);

  // update the group members list
  const memberPath = getMemberPath(userId);

  batch.update(groupRef, {
    [memberPath]: {
      user: userRef,
      role,
    },
  });

  // create the user record
  batch.set(userRef, {}, {});

  // delete the invite
  batch.delete(inviteDoc.ref);

  // automatically set the user as "onboarded"
  await auth.setCustomUserClaims(userId, {
    onboarded: true,
  });

  await batch.commit();
}

function getMemberPath(userId: string) {
  const membersPropertyKey: keyof Group = 'members';

  return `${membersPropertyKey}.${userId}`;
}

/**
 * @name getInviteByCode
 * @description Fetch an invite by its ID, without having to know the
 * group it belongs to
 * @param code
 */
export async function getInviteByCode(code: string) {
  const collection = getGroupInvitesCollection();
  const path: keyof GroupMembershipInvite = 'code';
  const op = '==';

  const query = collection.where(path, op, code);
  const ref = await query.get();

  if (ref.size) {
    return ref.docs[0];
  }
}
