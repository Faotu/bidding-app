import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import logger from '~/core/logger';

import { inviteGroupMembers } from '~/lib/server/groups/invite-members';
import { withAuthedUser } from '~/core/middleware/with-authed-user';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';
import { GroupMember } from '~/lib/groups/types/group';

const SUPPORTED_METHODS: HttpMethod[] = ['POST'];

async function inviteMembersToGroupHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const queryParamsSchemaResult = getQueryParamsSchema().safeParse(query);

  if (!queryParamsSchemaResult.success) {
    return throwBadRequestException();
  }

  const bodySchemaResult = getBodySchema().safeParse(req.body);

  if (!bodySchemaResult.success) {
    return throwBadRequestException();
  }

  const { groupId } = queryParamsSchemaResult.data;
  const invites = bodySchemaResult.data;
  const inviterId = req.firebaseUser.uid;

  try {
    await inviteGroupMembers({
      groupId,
      inviterId,
      invites,
    });

    logger.info(
      {
        groupId,
      },
      `User invited to group`
    );

    return res.send({ success: true });
  } catch (error) {
    logger.error(
      {
        groupId,
        inviterId,
      },
      `Error occurred when inviting user to group: ${error}`
    );

    return throwInternalServerErrorException(error?.toString());
  }
}

export default function inviteHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    inviteMembersToGroupHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    groupId: z.string().min(1),
  });
}

function getBodySchema() {
  return z.array(
    z.object({
      role: z.nativeEnum(GroupMember),
      email: z.string().email(),
    })
  );
}
