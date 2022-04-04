import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import SideMenu from '../components/SideMenu';
import { AuthService } from '../features/auth/auth-service';
import { authSelector } from '../features/auth/auth-slice';
import Router, { Routes } from './Router';
import { useAppSelector } from './store';

const App = (): JSX.Element => {
  const location = useLocation();
  const authService = new AuthService();

  useEffect(() => {
    // If the user is not currently logging in, refresh the token.
    if (location.pathname !== Routes.LoginCallback) {
      authService.refresh().then(() => {
        authService.getInfo();
      });
    }
  }, []);

  return (
    <React.StrictMode>
      <div className="flex">
        <div className="flex-none">
          <SideMenu />
        </div>
        <div className="flex-auto p-4 mx-auto">
          <Router />
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
