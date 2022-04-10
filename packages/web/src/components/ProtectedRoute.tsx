import { Logger } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Routes } from '../app/Router';
import useLoggedIn from '../common/hooks/use-logged-in';

const ProtectedRoute: React.FC = ({ children }: any) => {
  const navigate = useNavigate();
  const loggedIn = useLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      Logger.log('Redirecting to login page');
      navigate(Routes.Login);
    }
  });

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
