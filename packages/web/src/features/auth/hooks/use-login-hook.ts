import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { authSelector, setTokenInfo, setUserInfo, setValidated } from '../auth-slice';
import { getTokenInfo, getUserInfo, refreshToken, validateToken } from '../auth-utils';

const useLogin = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticating, isAuthenticated, isValidated, hasTokenInfo, expiresIn } = useAppSelector(authSelector);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Validate token after authentication
  useEffect(() => {
    if (isAuthenticating || !isAuthenticated) return;

    console.log('Validating token...');
    validateToken().then(async (valid) => {
      if (valid) dispatch(setValidated());
    });
  }, [isAuthenticated]);

  // Get token info after token validation
  useEffect(() => {
    if (isAuthenticating || !isValidated) return;

    console.log('Getting token info...');
    getTokenInfo().then(async (tokenInfo) => {
      if (tokenInfo) {
        dispatch(setTokenInfo(tokenInfo));
      }
    });
  }, [isValidated]);

  // Get user info after token info is set
  useEffect(() => {
    if (isAuthenticating || !hasTokenInfo) return;

    console.log('Getting user info...');
    getUserInfo().then(async (userInfo) => {
      if (userInfo) {
        dispatch(setUserInfo(userInfo));
        setIsLoggedIn(true);
      }
    });
  }, [hasTokenInfo]);

  useEffect(() => {
    if (!expiresIn) return;

    console.log('Setting refresh token timer...');
    const timer = setTimeout(async () => {
      const token = await refreshToken();
      if (token) {
        return token.expires_in;
      }
      return 0;
    }, expiresIn);
    return () => timer && clearTimeout(timer);
  }, [expiresIn]);

  return isLoggedIn;
};

export default useLogin;
