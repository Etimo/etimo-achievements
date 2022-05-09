import React, { useEffect } from 'react';
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
  const { loginState, expiresIn, userInfo, tokenInfo } = useAppSelector(authSelector);

  useEffect(() => {
    if (location.pathname === Routes.Login) {
      dispatch(setLoginState('should-login'));
    } else if (location.pathname === Routes.LoginCallback && query.get('code')) {
      dispatch(setLoginState('got-code'));
    } else if (location.pathname === Routes.Logout) {
      dispatch(setLoginState('should-logout'));
    }
  }, [location]);

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(setLoginState('got-accesstoken'));
    }
  }, []);

  const runLogin = async () => {
    window.location.href = process.env.API_URL + '/auth/login/google';
  };

  const runLoginCallback = async () => {
    const code = query.get('code');
    if (!code) return toast.error('No authorization code found in query parameters');

    const token = await loginCallback(code);
    if (token) {
      dispatch(setAccessToken(token));
      dispatch(setLoginState('got-accesstoken'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runValidateAccessToken = async () => {
    const valid = await validateToken();
    if (valid) {
      dispatch(setLoginState('validated-accesstoken'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runGetTokenInfo = async () => {
    const info = tokenInfo ?? (await getTokenInfo());
    if (info) {
      dispatch(setTokenInfo(info));
      dispatch(setLoginState('got-tokeninfo'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runGetUserInfo = async () => {
    const info = userInfo ?? (await getUserInfo());
    if (info) {
      dispatch(setUserInfo(info));
      dispatch(setLoginState('got-userinfo'));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runLoggedIn = async () => {
    navigate(Routes.UserProfile);
    dispatch(setLoginState('logged-in'));
  };

  const runRefreshToken = async () => {
    const token = await refreshToken();
    if (token) {
      dispatch(setLoginState('got-accesstoken'));
      dispatch(setAccessToken(token));
    } else {
      dispatch(setLoginState('failed-login'));
    }
  };

  const runLogout = async () => {
    console.log('Logging out');
    await logout();
    navigate(Routes.Home);
    dispatch(setLoginState('logged-out'));
  };

  const doStartRefreshTokenTimer = () => {
    const timeout = expiresIn ? expiresIn - 2000 : 0;

    const timer = setTimeout(() => {
      if (!expiresIn || expiresIn <= 0) return;
      dispatch(setLoginState('should-refresh-token'));
    }, timeout);

    return timer;
  };

  useEffect(() => {
    switch (loginState) {
      case 'should-login':
        runLogin();
        break;

      case 'got-code':
        runLoginCallback();
        break;

      case 'got-accesstoken':
        runValidateAccessToken();
        break;

      case 'validated-accesstoken':
        runGetTokenInfo();
        break;

      case 'got-tokeninfo':
        runGetUserInfo();
        break;

      case 'got-userinfo':
        runLoggedIn();
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
    const timer = doStartRefreshTokenTimer();
    return () => clearTimeout(timer);
  }, [expiresIn]);

  return <>{children}</>;
};

export default Authentication;
