import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../common/hooks/use-query';
import { LoginService } from './login-service';

const LoginCallback = (): JSX.Element => {
  const query = useQuery();
  const navigate = useNavigate();
  const loginService = new LoginService();
  const code = query.get('code');

  useEffect(() => {
    if (code) {
      loginService.loginWithCode(code).then(() => {
        navigate('/profile');
      });
    }
  });

  return <></>;
};

export default LoginCallback;
