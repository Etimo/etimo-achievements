import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/use-query';
import fetch from '../../utils/fetch';

const Login = (): JSX.Element => {
  const query = useQuery();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    const code = query.get('code');

    if (code) {
      fetch('/auth/callback/google?code=' + code).then((res) => {
        res.json().then((data) => {
          if (res.status === 200) {
            navigate('/profile');
          }
        });
      });
    } else {
      window.location.href = process.env.API_URL + '/auth/login/google';
    }
  });

  return <></>;
};

export default Login;
