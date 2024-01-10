import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import logger from '~/core/logger';

import {
  acceptInviteToGroup,
  getGroupMembers,
} from '~/lib/server/groups/memberships';

import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';

const SUPPORTED_METHODS: HttpMethod[] = ['POST', 'GET'];

async function membersHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, firebaseUser } = req;
  const userId = firebaseUser.uid;

  const { groupId } = getQueryParamsSchema().parse(req.query);

  switch (method) {
    case 'GET': {
      logger.info(
        {
          groupId,
        },
        `Fetching group members...`
      );

      const payload = { groupId, userId };
      const data = await getGroupMembers(payload);

      return res.send(data);
    }

    case 'POST': {
      await withCsrf()(req);

      const { code } = getBodySchema().parse(req.body);

      logger.info(
        {
          code,
          groupId,
          userId,
        },
        `Adding member to group...`
      );

      await acceptInviteToGroup({ code, userId });

      logger.info(
        {
          code,
          groupId,
          userId,
        },
        `Member successfully added to group`
      );

      return res.send({ success: true });
    }
  }
}

export default function members(req: NextApiRequest, res: NextApiResponse) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    membersHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    groupId: z.string().min(1),
  });
}

function getBodySchema() {
  return z.object({
    code: z.string().min(1),
  });
}
