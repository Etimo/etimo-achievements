import { fromBase64 } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import { Routes } from '../../app/Router';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import { authSelector, setAccessToken, setLoginState, setTokenInfo, setUserInfo } from './auth-slice';
import {
  getTokenInfo,
  getUserInfo,
  isLoggedIn,
  login,
  loginCallback,
  logout,
  refreshToken,
  validateToken,
} from './auth-utils';

const Authentication: React.FC = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const { loginState, expiresAt, userInfo, tokenInfo } = useAppSelector(authSelector);
  const [redirectUrl, setRedirectUrl] = useState<string>();

  const runLoginCallback = async () => {
    const code = query.get('code');
    if (!code) return toast.error('No authorization code found in query parameters');

    const token = await loginCallback(code);
    if (token) {
      dispatch(setAccessToken(token));
      dispatch(setLoginState('should-validate'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runValidateAccessToken = async () => {
    const valid = await validateToken();
    if (valid) {
      dispatch(setLoginState('logged-in'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runGetTokenInfo = async () => {
    if (tokenInfo) return;

    const info = await getTokenInfo();
    if (info) {
      dispatch(setTokenInfo(info));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runGetUserInfo = async () => {
    if (userInfo) return;

    const info = await getUserInfo();
    if (info) {
      dispatch(setUserInfo(info));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runRefreshToken = async () => {
    const token = await refreshToken();
    if (token) {
      dispatch(setAccessToken(token));
      dispatch(setLoginState('should-validate'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runLogout = async () => {
    await logout();
    navigate(Routes.Home);
    dispatch(setLoginState('logged-out'));
  };

  useEffect(() => {
    switch (loginState) {
      case 'should-login':
        login();
        break;

      case 'got-code':
        runLoginCallback();
        break;

      case 'should-validate':
        runValidateAccessToken();
        break;

      case 'logged-in':
        runGetTokenInfo();
        runGetUserInfo();
        break;

      case 'should-refresh-token':
        runRefreshToken();
        break;

      case 'should-logout':
      case 'failed-login':
        runLogout();
        break;
    }
  }, [loginState]);

  useEffect(() => {
    if (expiresAt) {
      const timer = setTimeout(() => dispatch(setLoginState('should-refresh-token')), expiresAt - Date.now());
      return () => clearTimeout(timer);
    }
  }, [expiresAt]);

  useEffect(() => {
    if (location.pathname === Routes.Login && !isLoggedIn()) {
      dispatch(setLoginState('should-login'));
    } else if (location.pathname === Routes.LoginCallback && query.get('code')) {
      dispatch(setLoginState('got-code'));

      const state = query.get('state');
      if (state) {
        const { redirectUrl } = JSON.parse(fromBase64(state));
        if (redirectUrl) {
          setRedirectUrl(redirectUrl);
        }
      }
    } else if (location.pathname === Routes.Logout) {
      dispatch(setLoginState('should-logout'));
    }
  }, [location]);

  useEffect(() => {
    if (redirectUrl && loginState === 'logged-in') {
      navigate(redirectUrl);
      setRedirectUrl(undefined);
    }
  }, [redirectUrl, loginState]);

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(setLoginState('should-validate'));
    }
  }, []);

  return <>{children}</>;
};

export default Authentication;
