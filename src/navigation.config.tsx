import configuration from '~/configuration';
import {
  CalendarDaysIcon,
  Cog8ToothIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const NAVIGATION_CONFIG = {
  items: [
    {
      label: 'common:dashboardTabLabel',
      path: configuration.paths.appHome,
      Icon: ({ className }: { className: string }) => {
        return <Squares2X2Icon className={className} />;
      },
    },
    {
      label: 'common:meetingsTabLabel',
      path: configuration.paths.meetings,
      Icon: ({ className }: { className: string }) => {
        return <CalendarDaysIcon className={className} />;
      },
    },
    {
      label: 'common:playersTabLabel',
      path: configuration.paths.players,
      Icon: ({ className }: { className: string }) => {
        return <UserGroupIcon className={className} />;
      },
    },
    {
      label: 'common:groupsTabLabel',
      path: configuration.paths.groups,
      Icon: ({ className }: { className: string }) => {
        return <UserGroupIcon className={className} />;
      },
      hidden: true,
    },
    {
      label: 'common:settingsTabLabel',
      path: '/settings',
      Icon: ({ className }: { className: string }) => {
        return <Cog8ToothIcon className={className} />;
      },
    },
  ],
};

export default NAVIGATION_CONFIG;
