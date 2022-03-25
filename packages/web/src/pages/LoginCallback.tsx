import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuery from '../hooks/use-query';
import fetch from '../utils/fetch';

const LoginCallback = (): JSX.Element => {
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const code = query.get('code');
    console.log(code);

    if (code) {
      fetch('/auth/callback/google?code=' + code).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            navigate('/profile');
          }
        });
      });
    }
  });

  return <></>;
};

export default LoginCallback;
