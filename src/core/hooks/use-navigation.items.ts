import { useRouter } from 'next/router';
import { useMemo } from 'react';
import NAVIGATION_CONFIG from 'src/navigation.config';
import configuration from '~/configuration';

/**
 * react hook that returns navigation items
 * @returns navigation items
 */
function useNavigationItems() {
  const router = useRouter();

  return useMemo(() => {
    // remove group path from NAVIGATION_CONFIG.items if feature flag in query string is not present
    const groupPathIndex = NAVIGATION_CONFIG.items.findIndex(
      (item) => item.path === configuration.paths.groups
    );
    if (groupPathIndex > -1 && !router.query.featureFlags?.includes('groups')) {
      NAVIGATION_CONFIG.items.splice(groupPathIndex, 1);
    }

    return NAVIGATION_CONFIG.items;
  }, [router.query.featureFlags]);
}

export default useNavigationItems;
