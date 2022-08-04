import { MantineProvider } from '@mantine/core';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import SideMenu from '../components/SideMenu';
import Authentication from '../features/auth/Authentication';
import Router from './Router';
import { theme } from './styles/mantine-theme';

const App = (): JSX.Element => {
  return (
    <React.StrictMode>
      <div className="flex min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex-none">
          <SideMenu />
        </div>
        <div className="p-4 w-full mx-auto">
          <MantineProvider withGlobalStyles theme={theme}>
            <Authentication>
              <Router />
            </Authentication>
          </MantineProvider>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default App;
