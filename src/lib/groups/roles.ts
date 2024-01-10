import { GroupMember } from './types/group';

/**
 * User Roles
 *
 * Here is where you can edit the user roles in your application according
 * to your application's domain.
 *
 * For example, you could add a role named
 * "Account Manager":
 * 1. extend the enum {@link GroupMember}
 * 2. add the i18n strings
 * 3. apply any needed change to ~/lib/permissions.ts
 * 4. add a new model below, so you can display the correct data in the
 * selector component {@link GroupMemberSelector}
 */

const OWNER = {
  label: 'common:roles.owner.label',
  description: 'common:roles.owner.description',
  value: GroupMember.owner,
};

// const ADMIN = {
//   label: 'common:roles.admin.label',
//   description: 'common:roles.admin.description',
//   value: GroupMember.Admin,
// };

const MEMBER = {
  label: 'common:roles.member.label',
  description: 'common:roles.member.description',
  value: GroupMember.member,
};

const roles = [OWNER, MEMBER];

export default roles;
