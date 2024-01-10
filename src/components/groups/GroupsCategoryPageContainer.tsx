import React, { useCallback } from 'react';
import Header from './Header';
import Footer from './Footer';
import DisplayMyGroups from './DisplayMyGroups';
import DisplayPublicGroups from './DisplayPublicGroups';

const GroupsCategoryPageContainer: React.FC<{ category?: string }> = ({
  category = '',
}) => {
  const renderCategoryDisplay = useCallback((category: string) => {
    switch (category) {
      case 'my-groups':
        return <DisplayMyGroups featured={false} />;
      default:
        return <DisplayPublicGroups featured={false} />;
    }
  }, []);
  return (
    <>
      <Header featured={false} />
      {renderCategoryDisplay(category)}
      <Footer />
    </>
  );
};

export default GroupsCategoryPageContainer;
