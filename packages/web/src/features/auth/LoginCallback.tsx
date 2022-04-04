import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { TokenInfoDto } from '../../common/dtos/token-info-dto';
import { UserInfoDto } from '../../common/dtos/user-info-dto';
import useQuery from '../../common/hooks/use-query';
import fetch from '../../common/utils/fetch';
import { login, setTokenInfo, setUserInfo } from './authSlice';

const LoginCallback = (): JSX.Element => {
  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = query.get('code');

    const loginCallback = async () => {
      await getToken();
      await validateToken();
      await getUserInfo();
      await getTokenInfo();
    };

    const getToken = async () => {
      const result = await fetch('/auth/callback/google?code=' + code);
      if (result.status === 200) {
      }
    };

    const validateToken = async () => {
      const result = await fetch('/auth/validate');
      if (result.status === 200) {
        dispatch(login());
      }
    };

    const getUserInfo = async () => {
      const result = await fetch('/auth/userinfo');
      if (result.status === 200) {
        const data = (await result.json()) as UserInfoDto;
        dispatch(setUserInfo(data));
      }
    };

    const getTokenInfo = async () => {
      const result = await fetch('/auth/introspect');
      if (result.status === 200) {
        const data = (await result.json()) as TokenInfoDto;
        dispatch(setTokenInfo(data));
      }
    };

    if (code) {
      loginCallback().then(() => navigate('/profile'));
    }
  });

  return <></>;
};

export default LoginCallback;
