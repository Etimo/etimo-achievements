import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Routes } from '../app/Router';
import { LocalStorage } from '../common/enums/local-storage';
import { Logger } from '../common/logger';
import useLoggedIn from '../features/auth/hooks/use-logged-in';

const ProtectedRoute: React.FC = ({ children }: any) => {
  const navigate = useNavigate();
  const loggedIn = useLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      Logger.log('Redirecting to login page');

      // Set redirect url to the current page. We will use this to redirect user after login
      localStorage.setItem(LocalStorage.RedirectUrl, window.location.pathname + window.location.search);

      navigate(Routes.Login);
    }
  }, [loggedIn]);

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
