import { authLogout } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { authSelector, setAccessToken, setLoginState, setTokenInfo, setUserInfo } from './auth-slice';
import { getTokenInfo, getUserInfo, isLoggedIn, refreshToken, validateToken } from './auth-utils';

const LoginSupport: React.FC = ({ children }) => {
  const dispatch = useAppDispatch();
  const { loginState, expiresIn, userInfo, tokenInfo } = useAppSelector(authSelector);

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(setLoginState('logged-in'));
    }
  }, []);

  const validateAccessToken = async () => {
    const valid = await validateToken();
    if (valid) {
      dispatch(setLoginState('validated-accesstoken'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const fetchTokenInfo = async () => {
    const info = tokenInfo ?? (await getTokenInfo());
    if (info) {
      dispatch(setTokenInfo(info));
      dispatch(setLoginState('got-tokeninfo'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const fetchUserInfo = async () => {
    const info = userInfo ?? (await getUserInfo());
    if (info) {
      dispatch(setUserInfo(info));
      dispatch(setLoginState('got-userinfo'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const startRefreshTokenTimer = () => {
    if (!expiresIn || expiresIn <= 0) return;

    return setTimeout(() => dispatch(setLoginState('should-refresh-token')), expiresIn);
  };

  const refresh = async () => {
    const token = await refreshToken();
    if (token) {
      dispatch(setLoginState('got-accesstoken'));
      dispatch(setAccessToken(token));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const logout = async () => {
    await authLogout().wait();
    dispatch(setLoginState('logged-out'));
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    switch (loginState) {
      case 'got-accesstoken':
        validateAccessToken();
        break;

      case 'validated-accesstoken':
        fetchTokenInfo();
        timer = startRefreshTokenTimer();
        break;

      case 'got-tokeninfo':
        fetchUserInfo();
        break;

      case 'got-userinfo':
        dispatch(setLoginState('logged-in'));
        break;

      case 'should-refresh-token':
        refresh();
        break;

      case 'failed-login':
        logout();
        break;
    }

    return () => timer && clearTimeout(timer);
  }, [loginState]);

  return <>{children}</>;
};

export default LoginSupport;
