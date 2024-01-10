import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { UpdateData } from 'firebase-admin/firestore';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

import logger from '~/core/logger';

import {
  throwForbiddenException,
  throwNotFoundException,
} from '~/core/http-exceptions';

import { getGroupById } from '~/lib/server/queries';
import { Group, GroupMember } from '~/lib/groups/types/group';
import withCsrf from '~/core/middleware/with-csrf';

const SUPPORTED_METHODS: HttpMethod[] = ['PUT'];

async function updateGroupOwnerHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { firebaseUser, query, body } = req;
  const { id: groupId } = getQueryParamsSchema().parse(query);
  const { userId: targetUserId } = getBodySchema().parse(body);

  const currentUserId = firebaseUser.uid;
  const groupRef = await getGroupById(groupId);
  const group = groupRef.data();

  logger.info(
    {
      groupId,
      currentUserId,
      targetUserId,
    },
    `Transferring Ownership`
  );

  // we check that the group exists
  if (!groupRef.exists || !group) {
    return throwNotFoundException(`Group was not found`);
  }

  // now, we want to validate that:
  // 1. the members exist
  // 2. the member calling the action is the owner of the group

  const members = group.members;
  const currentUserMembershipRole = members ? members[currentUserId] : null;
  const targetUserMembershipRole = members ? members[targetUserId]: null;

  if (!targetUserMembershipRole) {
    return throwNotFoundException(`Target member was not found`);
  }

  if (!currentUserMembershipRole) {
    return throwNotFoundException(`Current member was not found`);
  }

  if (currentUserMembershipRole !== GroupMember.owner) {
    return throwForbiddenException(`Current member is not the Owner`);
  }

  // validation finished! We should be good to go.

  // let's build the firestore update object to deeply update the nested
  // properties
  const updateData = {
    // [`members.${currentUserId}.role`]: GroupMember.Admin,
    [`members.${targetUserId}.role`]: GroupMember.owner,
  } as UpdateData<Group>;

  // now we can swap the roles by updating the members' roles in the
  // group's "members" object
  await groupRef.ref.update(updateData);

  logger.info(
    {
      groupId,
      currentUserId,
      targetUserId,
    },
    `Ownership successfully transferred to target user`
  );

  res.json({ success: true });
}

export default function owner(req: NextApiRequest, res: NextApiResponse) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    updateGroupOwnerHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    id: z.string().min(1),
  });
}

function getBodySchema() {
  return z.object({
    userId: z.string().min(1),
  });
}
