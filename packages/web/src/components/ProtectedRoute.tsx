import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { login } from '../features/auth/auth-utils';
import useLoggedIn from '../features/auth/hooks/use-logged-in';
import Login from '../features/auth/Login';

const ProtectedRoute: React.FC = ({ children }: any) => {
  const loggedIn = useLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      login();
    }
  }, [loggedIn]);

  return loggedIn ? <Outlet /> : <Login />;
};

export default ProtectedRoute;
