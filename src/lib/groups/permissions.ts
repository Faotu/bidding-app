import { GroupMember } from "./types/group";


/**
 * Permissions
 *
 * Permissions should be kept here or in a centralized place. Assuming you will add new custom
 * functions to check the user's permission to perform an action, it's recommended that you do it here
 *
 * This helps track down behavior rather than changing logic in every single place, which is
 * going to make it difficult to track down the logic. Keep this lightweight, so you don't need to make
 * different files for server vs client
 *
 * Permissions are defined such that a user can perform a disruptive option on other users
 * only if they have a greater role. For example, an Admin cannot remove another Admin from an organization
 *
 * You can update {@link GroupMember} however you wish according to your app's domain
 */


/**
 * @name canInviteUsers
 * @param currentUserRole
 * @description Checks if a role can change invite new users to an organization.
 * By default, only Owners and Admin can invite users
 */
export function canInviteUsers(currentUserRole: GroupMember) {
  return currentUserRole === GroupMember.owner;
}

/**
 * @description Check a user with role {@link inviterRole} can invite a user
 * with role {@link inviteeRole}.
 *
 * By default, users can invite users having the same or inferior role, and
 * ownership can only be transferred
 * @param inviterRole
 * @param inviteeRole
 * @name canInviteUser
 */
export function canInviteUser(
  inviterRole: GroupMember,
) {
  return canInviteUsers(inviterRole);
}

/**
 * @description Check if a user can delete invites
 * @param inviterRole
 * @name canDeleteInvites
 */
export function canDeleteInvites(inviterRole: GroupMember) {
  return canInviteUsers(inviterRole);
}
