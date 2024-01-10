import { GroupMember } from "./group";

export interface GroupMembershipInvite {
  email: string;
  role: GroupMember;
  code: string;
  expiresAt: number;

  group: {
    id: string;
    name: string;
  };
}
