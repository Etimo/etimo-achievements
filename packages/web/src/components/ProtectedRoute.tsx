import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Routes } from '../app/Router';
import { useAppSelector } from '../app/store';
import { LocalStorage } from '../common/enums/local-storage';
import { Logger } from '../common/logger';
import { authSelector } from '../features/auth/auth-slice';

const ProtectedRoute: React.FC = ({ children }: any) => {
  const navigate = useNavigate();
  const { loginState } = useAppSelector(authSelector);

  useEffect(() => {
    if (loginState === 'logged-out') {
      Logger.log('Redirecting to login page');

      // Set redirect url to the current page. We will use this to redirect user after login
      localStorage.setItem(LocalStorage.RedirectUrl, window.location.pathname + window.location.search);

      navigate(Routes.Login);
    }
  });

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
