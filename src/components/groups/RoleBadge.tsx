import { Trans } from 'next-i18next';
import Badge from '~/core/ui/Badge';
import { GroupMember } from '~/lib/groups/types/group';
import roles from '~/lib/groups/roles';

const classNames: Record<GroupMember, string> = {
  [GroupMember.owner]:
    'bg-yellow-400 text-current font-semibold dark:text-black-500',
  // [MembershipRole.Admin]: 'bg-blue-500 text-white font-semibold',
  [GroupMember.member]: 'bg-blue-500 text-white font-semibold',
};

const RoleBadge: React.FCC<{
  role: GroupMember;
}> = ({ role }) => {
  const data = roles.find((item) => item.value === role);

  return (
    <Badge color={'custom'} size={'small'} className={classNames[role]}>
      <span data-cy={'member-role-badge'}>
        <Trans i18nKey={data?.label} />
      </span>
    </Badge>
  );
};

export default RoleBadge;
