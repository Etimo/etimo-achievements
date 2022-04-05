import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../features/auth/Login';
import LoginCallback from '../features/auth/LoginCallback';
import Logout from '../features/auth/Logout';
import Home from '../pages/Home';
import Profile from '../pages/Profile';

export enum Routes {
  Home = '/',
  Login = '/login',
  LoginCallback = '/login/callback',
  Logout = '/logout',
  Profile = '/profile',
}

const Router = (): JSX.Element => {
  return (
    <ReactRoutes>
      <Route path={Routes.Home} element={<Home />} />
      <Route path={Routes.LoginCallback} element={<LoginCallback />} />
      <Route path={Routes.Login} element={<Login />} />
      <Route path={Routes.Logout} element={<Logout />} />

      <Route element={<ProtectedRoute />}>
        <Route path={Routes.Profile} element={<Profile />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
