import { MantineProvider } from '@mantine/core';
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
          <MantineProvider
            withGlobalStyles
            theme={{
              fontFamily: 'Segoe UI, sans-serif',
              fontFamilyMonospace: 'Segoe UI, sans-serif',
              components: {
                Select: {
                  styles: {
                    root: {
                      border: 'none',
                    },
                    wrapper: {
                      border: 'none',
                    },
                    item: {
                      fontFamily: 'Segoe UI, sans-serif',
                    },
                    input: {
                      backgroundColor: 'rgb(226 232 240)',
                      color: 'rgb(51 65 85)',
                      padding: '8px 16px',
                      fontSize: '100%',
                      border: 'solid 2px rgb(203 213 225)',
                      outline: 'none',
                      ':focus': {
                        backgroundColor: 'white',
                        outline: '2px solid transparent',
                        outlineOffset: '2px',
                        borderColor: 'rgb(100 116 139)',
                      },
                    },
                  },
                },
              },
            }}
          >
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
