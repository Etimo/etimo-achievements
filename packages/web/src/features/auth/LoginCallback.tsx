import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../../app/Router';
import useQuery from '../../common/hooks/use-query';
import { AuthService } from './auth-service';

const LoginCallback = (): JSX.Element => {
  const navigate = useNavigate();
  const code = useQuery().get('code');
  const authService = new AuthService();

  useEffect(() => {
    if (code) {
      authService.login(code).then(() => {
        navigate(Routes.UserProfile);
      });
    }
  }, []);

  return <></>;
};

export default LoginCallback;
