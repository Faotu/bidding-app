import { getAuth } from 'firebase-admin/auth';

import { MembershipRole } from '~/lib/organizations/types/membership-role';

import { getOrganizationsCollection, getUsersCollection } from '../collections';
import getRestFirestore from '~/core/firebase/admin/get-rest-firestore';
import { UserData } from '~/core/session/types/user-data';

/**
 * @name completeOnboarding
 * @description Handles the submission of the onboarding flow. By default,
 * we use the submission to create the Organization and the user record
 * associated with the User who signed up using its ID
 * @param userParams
 * @param organizationName
 */
export async function completeOnboarding(userParams: UserData, organizationName: string) {
  const { userId } = userParams;
  const firestore = getRestFirestore();
  const auth = getAuth();

  const batch = firestore.batch();

  const organizationRef = getOrganizationsCollection().doc();
  const userRef = getUsersCollection().doc(userId);

  const organizationMembers = {
    [userId]: {
      user: userRef,
      role: MembershipRole.Owner,
    },
  };

  // create organization
  batch.create(organizationRef, {
    name: organizationName,
    members: organizationMembers,
  });

  // create user
  batch.set(userRef, userParams);

  await batch.commit();

  // we can set the user as "onboarded" using the custom claims
  // it helps with not having to query Firestore for each request
  await auth.setCustomUserClaims(userId, {
    onboarded: true,
  });
}
