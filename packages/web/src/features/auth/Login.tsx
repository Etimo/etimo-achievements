import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(process.env.API_URL + '/auth/login/google');
  }, []);

  return null;
};

export default Login;
