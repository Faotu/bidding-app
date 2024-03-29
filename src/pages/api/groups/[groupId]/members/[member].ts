import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
// import logger from '~/core/logger';

import {
  // removeMemberFromOrganization,
  // updateMemberRole,
} from '~/lib/server/groups/memberships';

import {
  throwBadRequestException,
  throwUnauthorizedException,
} from '~/core/http-exceptions';

import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';
import { GroupMember } from '~/lib/groups/types/group';

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['DELETE', 'PUT'];

async function groupMemberHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, firebaseUser } = req;
  const currentUserId = firebaseUser.uid;

  // validate and parse query params
  const queryParamsSchema = getQueryParamsSchema().safeParse(query);

  if (!queryParamsSchema.success) {
    return throwBadRequestException();
  }

  const payload = {
    groupId: queryParamsSchema.data.groupId,
    targetUserId: queryParamsSchema.data.member,
    currentUserId,
  };

  if (payload.targetUserId === currentUserId) {
    return throwUnauthorizedException(
      `The current user cannot dispatch actions about itself`
    );
  }

  // for PUT requests - update the member
  // if (method === 'PUT') {
  //   const schema = getUpdateMemberSchema();
  //   const { role } = schema.parse(req.body);
  //   const updatePayload = { ...payload, role };

  //   // update member role
  //   await updateMemberRole(updatePayload);

  //   logger.info(updatePayload, `User role updated`);

  //   return res.send({ success: true });
  // }

  // for DELETE requests - remove the member
  // if (method === 'DELETE') {
  //   // remove member from group
  //   await removeMemberFromOrganization(payload);

  //   logger.info(payload, `User removed from group`);

  //   return res.send({ success: true });
  // }
}

export default function membersHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    groupMemberHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getUpdateMemberSchema() {
  return z.object({
    role: z.nativeEnum(GroupMember),
  });
}

function getQueryParamsSchema() {
  return z.object({
    groupId: z.string(),
    member: z.string(),
  });
}
