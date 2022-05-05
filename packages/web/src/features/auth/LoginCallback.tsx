import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import { useAppDispatch } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import { setLoggedIn } from './auth-slice';
import { getRedirectUrl, loginCallback, setRedirectUrl } from './auth-utils';

const LoginCallback = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const dispatch = useAppDispatch();

  const getCode = () => query.get('code') ?? '';

  const login = async (code: string) => {
    if (await loginCallback(code)) {
      dispatch(setLoggedIn());

      // Fetch the redirect url from local storage
      const redirectUrl = getRedirectUrl();
      if (redirectUrl) {
        navigate(redirectUrl);

        // Clear the redirect url since we don't need it anymore
        setRedirectUrl();
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
