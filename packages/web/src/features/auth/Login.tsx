import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { storeLoggingIn } from './auth-utils';

const Login = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    storeLoggingIn();
    window.location.href = process.env.API_URL + '/auth/login/google';
  }, []);

  return null;
};

export default Login;
