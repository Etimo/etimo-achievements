import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from './auth-service';

const Logout = (): JSX.Element => {
  const navigate = useNavigate();
  const authService = new AuthService();

  useEffect(() => {
    authService.logout();
    navigate('/');
  });

  return <></>;
};

export default Logout;
