import { authUserInfo } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router';
import SideMenu from '../components/SideMenu';
import { setLoggedIn, setLoggingIn, setUserInfo } from '../features/auth/auth-slice';
import { refreshToken } from '../features/auth/auth-utils';
import Router, { Routes } from './Router';
import { useAppDispatch } from './store';

const App = (): JSX.Element => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [expiresIn, setExpiresIn] = useState<number>();

  const refresh = async () => {
    const token = await refreshToken();
    if (token) {
      setExpiresIn(token.expires_in);
      dispatch(setLoggedIn());
      return true;
    }
    return false;
  };

  // Refresh token when loading page
  useEffect(() => {
    dispatch(setLoggingIn());
    refresh().then(async (success) => {
      if (success) {
        const userInfo = await authUserInfo().data();
        if (userInfo) {
          dispatch(setUserInfo(userInfo));
        }
      }
    });
  }, []);

  // Refresh token timer
  useEffect(() => {
    let timer: any;
    if (location.pathname !== Routes.LoginCallback) {
      timer = setTimeout(() => refresh(), expiresIn);
    }
    return () => timer && clearTimeout(timer);
  }, [expiresIn]);

  return (
    <React.StrictMode>
      <div className="flex min-h-screen">
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
