import { useEffect } from 'react';
import { setLoggingIn } from './auth-utils';

const Login = () => {
  useEffect(() => {
    setLoggingIn();
    window.location.href = process.env.API_URL + '/auth/login/google';
  }, []);

  return null;
};

export default Login;
