import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import fetch from '../../common/utils/fetch';
import { login } from './authSlice';

const LoginCallback = (): JSX.Element => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = query.get('code');

    if (code) {
      fetch('/auth/callback/google?code=' + code).then((res) => {
        res.json().then((_data) => {
          if (res.status === 200) {
            dispatch(login());
            navigate('/profile');
          }
        });
      });
    }
  });

  return <></>;
};

export default LoginCallback;
