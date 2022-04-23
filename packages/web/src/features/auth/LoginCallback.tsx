import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import { LocalStorage } from '../../common/enums/local-storage';
import useQuery from '../../common/hooks/use-query';
import { AuthService } from './auth-service';

const LoginCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const code = useQuery().get('code');
  const authService = new AuthService();

  useEffect(() => {
    if (code) {
      authService.login(code).then(() => {
        // Fetch the redirect url from local storage
        const redirectUrl = localStorage.getItem(LocalStorage.RedirectUrl);
        if (redirectUrl) {
          navigate(redirectUrl);

          // Clear the redirect url since we don't need it anymore
          localStorage.removeItem(LocalStorage.RedirectUrl);
        } else {
          navigate(Routes.UserProfile);
        }
      });
    }
  }, []);

  return <></>;
};

export default LoginCallback;
