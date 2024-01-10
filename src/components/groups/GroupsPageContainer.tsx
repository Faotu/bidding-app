import React from 'react';
import Header from './Header';
import Footer from './Footer';
import DisplayMyGroups from './DisplayMyGroups';
import DisplayPublicGroups from './DisplayPublicGroups';

const GroupsPageContainer: React.FC = () => {
  return (
    <div>
      <Header featured />
      <DisplayMyGroups featured />
      <hr className='my-8' />
      <DisplayPublicGroups featured />
      <Footer />
    </div>
  );
};

export default GroupsPageContainer;
