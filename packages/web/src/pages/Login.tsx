import React, { useEffect } from 'react';

const LoginCallback = (): JSX.Element => {
  useEffect(() => {
    window.location.href = process.env.API_URL + '/auth/login/google';
  });

  return <></>;
};

export default LoginCallback;
