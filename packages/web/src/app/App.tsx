import React from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from '../components/SideMenu';
import useLogin from '../features/auth/hooks/use-login-hook';
import Router from './Router';

const App = (): JSX.Element => {
  const loggedIn = useLogin();

  return (
    <React.StrictMode>
      <div className="flex min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex-none">
          <SideMenu />
          {loggedIn}
        </div>
        <div className="p-4 w-full mx-auto">
          <Router />
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
