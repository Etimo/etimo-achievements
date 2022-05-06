import { uuid } from '@etimo-achievements/common';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { authSelector, setAccessToken, setTokenInfo, setUserInfo, setValidated } from '../auth-slice';
import { getTokenInfo, getUserInfo, isLoggedIn, isLoggingIn, refreshToken, validateToken } from '../auth-utils';

const useLogin = () => {
  const dispatch = useAppDispatch();
  const { isValidated, hasAccessToken, hasTokenInfo, expiresIn } = useAppSelector(authSelector);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [shouldRefresh, setShouldRefresh] = useState<string>();

  // Initial state -- are we logged in? This will check local storage.
  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setLoggingIn(isLoggingIn());
  }, []);

  // Validate token after getting access token
  useEffect(() => {
    if (loggedIn || loggingIn || !hasAccessToken) return;

    console.log('Validating token...');
    validateToken().then(async (valid) => {
      if (valid) dispatch(setValidated());
    });
  }, [hasAccessToken]);

  // Get token info after token validation
  useEffect(() => {
    if (loggedIn || loggingIn || !isValidated) return;

    console.log('Getting token info...');
    getTokenInfo().then(async (tokenInfo) => {
      if (tokenInfo) {
        dispatch(setTokenInfo(tokenInfo));
      }
    });
  }, [isValidated]);

  // Get user info after token info is set
  useEffect(() => {
    if (loggedIn || loggingIn || !hasTokenInfo) return;

    console.log('Getting user info...');
    getUserInfo().then(async (userInfo) => {
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
      }
    });
  }, [hasTokenInfo]);

  useEffect(() => {
    if (!expiresIn) return;

    console.log('Setting refresh token timer...');
    const timer = setTimeout(() => setShouldRefresh(uuid()), expiresIn);

    return () => timer && clearTimeout(timer);
  }, [expiresIn]);

  useEffect(() => {
    if (!shouldRefresh) return;

    console.log('Refreshing token...');
    refreshToken().then(async (token) => {
      if (token) {
        dispatch(setAccessToken(token));
      }
    });
  }, [shouldRefresh]);

  return loggedIn;
};

export default useLogin;
