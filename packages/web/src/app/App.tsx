import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router';
import SideMenu from '../components/SideMenu';
import { AuthService } from '../features/auth/auth-service';
import Router, { Routes } from './Router';

const App = (): JSX.Element => {
  const location = useLocation();
  const authService = new AuthService();

  useEffect(() => {
    // If the user is not currently logging in, refresh the token.
    if (location.pathname !== Routes.LoginCallback) {
      authService.initialize().then((success) => {
        if (success) {
          authService.getInfo();
        }
      });
    }
  }, []);

  return (
    <React.StrictMode>
      <div className="flex">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex-none">
          <SideMenu />
        </div>
        <div className="p-4 w-full mx-auto">
          <Router />
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
