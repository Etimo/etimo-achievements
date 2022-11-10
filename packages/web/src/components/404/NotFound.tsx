import React from 'react';
import Header from '../Header';

const NotFound = (): JSX.Element => {
  return (
    <div className="w-2/3 mx-auto">
      <Header className="flex flex-col">404 Not Found</Header>
      <span>The page you tried to access does not exist.</span>
    </div>
  );
};

export default NotFound;
