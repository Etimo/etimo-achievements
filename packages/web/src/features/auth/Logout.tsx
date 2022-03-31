import React, { useEffect } from 'react';

const Logout = (): JSX.Element => {
  useEffect(() => {
    localStorage.setItem('loggedIn', 'false');
  });

  return <></>;
};

export default Logout;
