import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Routes } from '../app/Router';
import useLoggedIn from '../features/auth/hooks/use-logged-in';
import useLoginState from '../features/auth/hooks/use-login-state';

const ProtectedRoute = () => {
  const loginState = useLoginState();
  const loggedIn = useLoggedIn();
  const navigate = useNavigate();

  if (loggedIn) {
    return <Outlet />;
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate(Routes.Login + '?state=' + loginState);
    }
  }, []);

  return null;
};

export default ProtectedRoute;
