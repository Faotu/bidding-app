import roles from '~/lib/groups/roles';
import { GroupMember } from '~/lib/groups/types/group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/core/ui/Select';
import { Trans } from 'react-i18next';

const MembershipRoleSelector: React.FCC<{
  value?: GroupMember;
  onChange?: (role: GroupMember) => unknown;
}> = ({ value: currentRole, onChange }) => {
  return (
    <Select
      value={currentRole}
      onValueChange={(role: GroupMember) => {
        onChange && onChange(role);
      }}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {roles.map((role) => {
          return (
            // <IfHasPermissions
            //   key={role.value}
            //   condition={(currentUserRole) =>
            //     canInviteUser(currentUserRole, role.value)
            //   }
            // >
            <SelectItem value={role.value} key={role.label}>
              <Trans i18nKey={role?.label} />
            </SelectItem>
            // </IfHasPermissions>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default MembershipRoleSelector;
