import GroupCard from './GroupCard';
import { Group } from '~/lib/groups/types/group';
import EmptyData from './EmptyData';

const Groups: React.FCC<{
  groups: Group[];
}> = ({ groups }) => {
  if (!groups?.length) {
    return <EmptyData title="No groups available" />;
  }
  return (
    <ul role='list' className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={`${group.ownerId}_${group.groupId}`} group={group} />
      ))}
    </ul>
  );
};

export default Groups;
