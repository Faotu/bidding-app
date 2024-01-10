import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withPipe } from '~/core/middleware/with-pipe';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';
import withCsrf from '~/core/middleware/with-csrf';
import admin from 'firebase-admin';

const Body = z.object({
  availability: z.string(),
  timezone: z.string(),
});

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

async function availabilityHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = await Body.parseAsync(req.body);
  const userId = req.firebaseUser.uid;

  const {
    availability,
    timezone,
  } = body;

  const db = admin.firestore();

  const userRef = db.collection('users').doc(userId);

  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const updatedData = {
    ...userDoc.data(),
    availability: JSON.parse(availability),
    timezone,
  };

  await userRef.update(updatedData);

  return res.send({
    success: true,
    message: "Updated successfully!",
    availability,
  });
}

export default function updateAvailabilityHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withPipe(
    withCsrf(),
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    availabilityHandler
  );

  return withExceptionFilter(req, res)(handler);
}
