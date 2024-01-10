import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';

const links: any = {
  General: {
    path: '/group/{groupId}/settings/',
    i18n: 'group:generalTabLabel',
  },
  Members: {
    path: '/group/{groupId}/members',
    i18n: 'group:membersTabLabel',
  },
};

const GroupSettingsTabs: React.FC<{ groupId: string }> = ({ groupId }) => {
  const router = useRouter();
  const itemClassName = `flex justify-center lg:justify-start items-center flex-auto lg:flex-initial`;
  const navLinks = useMemo(() => {
    const results: any = {};
    Object.keys(links).forEach((category) => {
      results[category] = {
        ...links[category],
        path: links[category].path.replace('{groupId}', groupId),
      };
    });
    return results;
  }, [groupId]);
  return (
    <div>
      <a
        role="button"
        className="flex w-[140px] items-center pr-3 mb-3 underline"
        onClick={() => router.push(`/group/${groupId}/details`)}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span>Go back</span>
      </a>
      <NavigationMenu secondary vertical>
        <NavigationItem
          className={itemClassName}
          link={navLinks.General}
          depth={0}
        />

        <NavigationItem className={itemClassName} link={navLinks.Members} />
      </NavigationMenu>
    </div>
  );
};

export default GroupSettingsTabs;
