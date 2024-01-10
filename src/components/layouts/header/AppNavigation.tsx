import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationContainer from '~/core/ui/Navigation/NavigationContainer';
import useNavigationItems from '~/core/hooks/use-navigation.items';

const AppNavigation: React.FCC = () => {
  const navigationItems = useNavigationItems();
  return (
    <NavigationContainer>
      <NavigationMenu bordered>
        {navigationItems.map((item) => {
          if (item.hidden) {
            return null;
          }
          return <NavigationItem key={item.path} link={item} />;
        })}
      </NavigationMenu>
    </NavigationContainer>
  );
};

export default AppNavigation;
