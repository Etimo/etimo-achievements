import React from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from '../components/SideMenu';
import Authentication from '../features/auth/Authentication';
import Router from './Router';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <div className="flex min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex-none">
          <SideMenu />
        </div>
        <div className="p-4 w-full mx-auto">
          <Authentication>
            <Router />
          </Authentication>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
