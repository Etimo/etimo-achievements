import React from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from '../components/SideMenu';
import LoginSupport from '../features/auth/LoginSupport';
import Router from './Router';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <LoginSupport>
        <div className="flex min-h-screen">
          <Toaster position="top-right" reverseOrder={false} />
          <div className="flex-none">
            <SideMenu />
          </div>
          <div className="p-4 w-full mx-auto">
            <Router />
          </div>
        </div>
      </LoginSupport>
    </React.StrictMode>
  );
};

export default App;
