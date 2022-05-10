import { fromBase64 } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router';
import { Routes } from '../../app/Router';
import { useAppDispatch, useAppSelector } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import { authSelector, setAccessToken, setLoggedIn, setLoggedOut, setTokenInfo, setUserInfo } from './auth-slice';
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

type LoginState =
  | 'logged-out'
  | 'login'
  | 'failed-login'
  | 'got-code'
  | 'got-token'
  | 'token-expired'
  | 'maybe-logged-in'
  | 'logged-in'
  | 'logout';

const Authentication: React.FC = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const { expiresAt, userInfo, tokenInfo } = useAppSelector(authSelector);
  const [redirectUrl, setRedirectUrl] = useState<string>();
  const [loginState, setLoginState] = useState<LoginState>();

  /**
   * If we think we're logged in, validate it.
   */
  useEffect(() => {
    if (isLoggedIn()) {
      setLoginState('maybe-logged-in');
    }
  }, []);

  /**
   * Use the path to determine what auth state we're in when loading the page.
   */
  useEffect(() => {
    // If we're on the login page, and we haven't stored login state, we're trying to login.
    if (location.pathname === Routes.Login) {
      if (!isLoggedIn()) {
        setLoginState('login');
      }
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) setRedirectUrl(redirectUrl);
    }

    // If we're on the login callback page, and we have a code, we're at the 'got-code' state.
    else if (location.pathname === Routes.LoginCallback && query.get('code')) {
      setLoginState('got-code');
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) setRedirectUrl(redirectUrl);
    }

    // If we're on the logout page, we're trying to logout.
    else if (location.pathname === Routes.Logout) {
      setLoginState('logout');
    }
  }, [location]);

  /**
   * When the redirect url is set, and we're marked as logged in, we are free to redirect.
   */
  useEffect(() => {
    if (redirectUrl && loginState === 'logged-in') {
      navigate(redirectUrl);
      setRedirectUrl(undefined);
    }
  }, [redirectUrl, loginState]);

  /**
   * Handle the different states of the login process.
   */
  useEffect(() => {
    switch (loginState) {
      // We're trying to login.
      case 'login':
        login(redirectUrl);
        break;

      // We got an authorization code from query parameters.
      case 'got-code':
        runLoginCallback();
        break;

      // We got an access token, or think we have.
      case 'got-token':
      case 'maybe-logged-in':
        runValidateAccessToken();
        break;

      // We've validated the access token, and we're logged in.
      case 'logged-in':
        dispatch(setLoggedIn());
        runGetTokenInfo();
        runGetUserInfo();
        break;

      // The token has expired and needs to be refreshed.
      case 'token-expired':
        runRefreshToken();
        break;

      // We're trying to logout, or the login process failed.
      case 'logout':
      case 'failed-login':
        runLogout();
        break;
    }
  }, [loginState]);

  /**
   * When the token expiration date changes, update the expiration timer to the new expiration date.
   */
  useEffect(() => {
    if (expiresAt) {
      const timeout = Math.max(10000, expiresAt - Date.now() - 120 * 1000); // At least wait 10 seconds.
      const timer = setTimeout(() => setLoginState('token-expired'), timeout);
      return () => clearTimeout(timer);
    }
  }, [expiresAt]);

  /**
   * Get token by calling the login callback api endpoint with the authorization code.
   */
  const runLoginCallback = async () => {
    const code = query.get('code');
    if (!code) return toast.error('No authorization code found in query parameters');

    const token = await loginCallback(code);
    if (token) {
      dispatch(setAccessToken(token));
      setLoginState('got-token');
    } else {
      setLoginState('failed-login');
    }
  };

  /**
   * Validate the token by calling the validate endpoint.
   */
  const runValidateAccessToken = async () => {
    const valid = await validateToken();
    if (valid) {
      setLoginState('logged-in');
    } else {
      setLoginState('failed-login');
    }
  };

  /**
   * Get token info by calling the token info endpoint.
   */
  const runGetTokenInfo = async () => {
    if (tokenInfo) return;

    const info = await getTokenInfo();
    if (info) {
      dispatch(setTokenInfo(info));
    } else {
      setLoginState('failed-login');
    }
  };

  /**
   * Get user info by calling the user info endpoint.
   */
  const runGetUserInfo = async () => {
    if (userInfo) return;

    const info = await getUserInfo();
    if (info) {
      dispatch(setUserInfo(info));
    } else {
      setLoginState('failed-login');
    }
  };

  /**
   * Refresh the token by calling the refresh endpoint.
   */
  const runRefreshToken = async () => {
    const token = await refreshToken();
    if (token) {
      dispatch(setAccessToken(token));
      setLoginState('got-token');
    } else {
      setLoginState('failed-login');
    }
  };

  /**
   * Logout by calling the logout endpoint.
   */
  const runLogout = async () => {
    await logout();
    navigate(Routes.Home);
    setLoginState('logged-out');
    dispatch(setLoggedOut());
  };

  /**
   * Return the redirect url from the query parameters.
   */
  const getRedirectUrl = () => {
    const state = query.get('state');
    if (state) {
      const { redirectUrl } = JSON.parse(fromBase64(state));
      return redirectUrl;
    }
  };

  return <>{children}</>;
};

export default Authentication;
