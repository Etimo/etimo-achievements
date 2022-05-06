import { uuid } from '@etimo-achievements/common';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  authSelector,
  setAccessToken,
  setAuthenticating,
  setLoggedIn,
  setTokenInfo,
  setUserInfo,
  setValidated,
} from '../auth-slice';
import { getTokenInfo, getUserInfo, isLoggingIn, refreshToken, validateToken } from '../auth-utils';

const useLogin = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, isAuthenticating, isValidated, hasAccessToken, hasTokenInfo, expiresIn, hasUserInfo } =
    useAppSelector(authSelector);
  const [shouldRefresh, setShouldRefresh] = useState<string>();

  /**
   * Initial state -- are we logging in? This will check local storage.
   * The reason for this is because the state is lost when we navigate
   * to login at Google, so we need to persist the login state.
   */
  useEffect(() => {
    dispatch(setAuthenticating(isLoggingIn()));
  }, []);

  // Validate token after getting access token
  useEffect(() => {
    if (isLoggedIn || isAuthenticating || !hasAccessToken) return;

    validateToken().then(async (valid) => {
      if (valid) dispatch(setValidated());
    });
  }, [hasAccessToken]);

  // Get token info & access info after token validation
  useEffect(() => {
    if (isLoggedIn || isAuthenticating || !isValidated) return;

    getTokenInfo().then(async (tokenInfo) => {
      if (tokenInfo) {
        dispatch(setTokenInfo(tokenInfo));
      }
    });
  }, [isValidated]);

  // Get access info after we get token info
  useEffect(() => {
    if (isLoggedIn || isAuthenticating || !hasTokenInfo) return;

    getUserInfo().then(async (userInfo) => {
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
        dispatch(setLoggedIn());
      }
    });
  }, [hasTokenInfo]);

  // Set refresh token timer when we know when it expires
  useEffect(() => {
    if (!expiresIn || expiresIn <= 0) return;

    const timer = setTimeout(() => setShouldRefresh(uuid()), expiresIn);

    return () => timer && clearTimeout(timer);
  }, [expiresIn]);

  // Refresh token when refresh token trigger is fired
  useEffect(() => {
    if (!shouldRefresh) return;

    refreshToken().then(async (token) => {
      if (token) {
        dispatch(setAccessToken(token));
      }
    });
  }, [shouldRefresh]);

  return isLoggedIn;
};

export default useLogin;
