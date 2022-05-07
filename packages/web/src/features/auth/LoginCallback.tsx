import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import { useAppDispatch } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import { setAccessToken, setLoginState } from './auth-slice';
import { getRedirectUrl, loginCallback, storeRedirectUrl } from './auth-utils';

const LoginCallback = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const dispatch = useAppDispatch();

  const getCode = () => query.get('code') ?? '';

  const login = async (code: string) => {
    const token = await loginCallback(code);
    if (token) {
      dispatch(setAccessToken(token));
      dispatch(setLoginState('got-accesstoken'));

      // Fetch the redirect url from local storage
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) {
        navigate(redirectUrl);

        // Clear the redirect url since we don't need it anymore
        storeRedirectUrl();
      } else {
        navigate(Routes.UserProfile);
      }
    } else {
      navigate(Routes.Home);
    }
  };

  useEffect(() => {
    if (getCode()) {
      login(getCode());
    }
  }, [getCode()]);

  return null;
};

export default LoginCallback;
