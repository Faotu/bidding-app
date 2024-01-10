import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import logger from '~/core/logger';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withPipe } from '~/core/middleware/with-pipe';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import { getScheduledMeetingAttendees } from '~/lib/server/groups/schedules/attendees';

const SUPPORTED_METHODS: HttpMethod[] = ['POST', 'GET'];

async function attendeesHandler(req: NextApiRequest, res: NextApiResponse) {
  const { method, firebaseUser } = req;
  const userId = firebaseUser.uid;

  const { id: scheduledMeetingId, groupId } = getQueryParamsSchema().parse(req.query);
  switch (method) {
    case 'GET': {
      logger.info(
        {
          scheduledMeetingId,
          groupId
        },
        `Fetching scheduled meeting attendees...`
      );

      const payload = { scheduledMeetingId, userId, groupId };
      const data = await getScheduledMeetingAttendees(payload);

      return res.send(data);
    }
  }
}

export default function attendees(req: NextApiRequest, res: NextApiResponse) {
  const handler = withPipe(
    withMethodsGuard(SUPPORTED_METHODS),
    withAuthedUser,
    attendeesHandler
  );

  return withExceptionFilter(req, res)(handler);
}

function getQueryParamsSchema() {
  return z.object({
    id: z.string().min(1),
    groupId: z.string().min(1),
  });
}
