import { addDays } from 'date-fns';

// import { canInviteUser } from '~/lib/groups/permissions';
import renderGroupInviteEmail from '~/lib/emails/group-invite';
import { GroupMembershipInvite } from '~/lib/groups/types/membership-invite';

import { sendEmail } from '~/core/email/send-email';
import configuration from '~/configuration';
import { getUserInfoById } from '~/core/firebase/admin/auth/get-user-info-by-id';

import { getGroupById } from '../queries';
import logger from '~/core/logger';
import { GroupMember } from '~/lib/groups/types/group';

interface Invite {
  email: string;
  role: GroupMember;
}

interface Params {
  groupId: string;
  inviterId: string;
  invites: Invite[];
}

// change this constant to set a different amount of days
// for the invite to expire
const INVITE_EXPIRATION_DAYS = 7;

export async function inviteGroupMembers(params: Params) {
  const { groupId, invites, inviterId } = params;

  const inviter = await getUserInfoById(inviterId);
  const group = await getGroupById(groupId);
  const groupData = group.data();



  if (!groupData) {
    throw new Error(
      `Group data with ID ${groupId} was not found`
    );
  }

  const groupName = groupData.settings.name;
  const inviterRole = groupData?.members ? groupData?.members[inviterId] : 'owner';

  // validate that the inviter is currently in the group
  if (inviterRole === undefined) {
    throw new Error(
      `Invitee with ID ${inviterId} does not belong to the group`
    );
  }

  const invitesCollection = group.ref.collection(`invites`);
  const requests: Array<Promise<unknown>> = [];

  const expiresAt = addDays(new Date(), INVITE_EXPIRATION_DAYS).getTime();

  for (const invite of invites) {
    const ref = invitesCollection.doc();

    // validate that the user has permissions
    // to invite the user based on their roles
    // if (!canInviteUser(inviterRole, invite.role)) {
    //   return;
    // }

    const inviterDisplayName =
      inviter?.displayName ?? inviter?.email ?? undefined;

    const sendEmailRequest = () =>
      sendInviteEmail({
        invitedUserEmail: invite.email,
        inviteCode: ref.id,
        groupName,
        groupId: groupData.groupId,
        inviter: inviterDisplayName,
      });

    const field: keyof GroupMembershipInvite = 'email';
    const op = '==';

    const existingInvite = await invitesCollection
      .where(field, op, invite.email)
      .get();

    const inviteExists = !existingInvite.empty;

    // this callback will be called when the promise fails
    const catchCallback = (error: unknown) => {
      logger.error(
        {
          inviteId: ref.id,
          inviter: inviter?.uid,
          groupId,
        },
        `Error while sending invite to member`
      );

      logger.debug(error);

      return Promise.reject(error);
    };

    // if an invitation to the email {invite.email} already exists,
    // then we update the existing document
    if (inviteExists) {
      const doc = existingInvite.docs[0];

      const request = async () => {
        try {
          // update invitation document
          await doc.ref.update({ ...invite });

          // send email
          await sendEmailRequest();
        } catch (e) {
          return catchCallback(e);
        }
      };

      // add a promise for each invite
      requests.push(request());
    } else {
      // otherwise, we create a new document with the invite
      const request = async () => {
        const data: GroupMembershipInvite = {
          ...invite,
          code: ref.id,
          expiresAt,
          group: {
            id: groupId,
            name: groupData?.settings.name ?? '',
          },
        };

        try {
          // add invite to the Firestore collection
          await invitesCollection.add(data);

          // send email to user
          await sendEmailRequest();
        } catch (e) {
          return catchCallback(e);
        }
      };

      // add a promise for each invite
      requests.push(request());
    }
  }

  return Promise.all(requests);
}

function sendInviteEmail(props: {
  invitedUserEmail: string;
  inviteCode: string;
  groupName: string;
  groupId: string;
  inviter: Maybe<string>;
}) {
  const {
    invitedUserEmail,
    inviteCode,
    groupName,
    groupId,
    inviter,
  } = props;

  const sender = configuration.email.senderAddress;
  const productName = configuration.site.siteName;

  const subject = 'You have been invited to join an group!';
  const link = getInvitePageFullUrl(inviteCode, groupId);

  const html = renderGroupInviteEmail({
    productName,
    link,
    groupName,
    invitedUserEmail,
    inviter,
  });

  return sendEmail({
    to: invitedUserEmail,
    from: sender,
    subject,
    html,
  });
}

/**
 * @name getInvitePageFullUrl
 * @description Return the full URL to the invite page link. For example,
 * someurl.com/auth/invite/{INVITE_CODE}
 * @param inviteCode
 */
function getInvitePageFullUrl(inviteCode: string, groupId: string) {
  let siteUrl = configuration.site.siteUrl;

  if (configuration.emulator) {
    siteUrl = getEmulatorHost();
  }

  assertSiteUrl(siteUrl);

  return [siteUrl, 'group', groupId].join('/');
}

function assertSiteUrl(siteUrl: Maybe<string>): asserts siteUrl is string {
  if (!siteUrl && configuration.production) {
    throw new Error(
      `Please configure the "siteUrl" property in the configuration file ~/configuration.ts`
    );
  }
}

function getEmulatorHost() {
  const host = `http://localhost`;
  const port = 3000;

  return [host, port].join(':');
}
