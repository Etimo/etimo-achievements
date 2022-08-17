import React from 'react';
import AwardListComponent from '../../components/AwardList/AwardList';
import Header from '../../components/Header';

const AwardList: React.FC = () => {
  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <AwardListComponent />
    </div>
  );
};

export default AwardList;
