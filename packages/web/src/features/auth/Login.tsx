import { useEffect } from 'react';
import { useAppDispatch } from '../../app/store';
import { setLoggingIn } from './auth-slice';
import { storeLoggingIn } from './auth-utils';

const Login = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoggingIn());
    storeLoggingIn();
    window.location.href = process.env.API_URL + '/auth/login/google';
  }, []);

  return null;
};

export default Login;
