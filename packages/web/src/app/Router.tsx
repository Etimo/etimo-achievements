import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AchievementCreate from '../features/achievements/AchievementCreate';
import AchievementList from '../features/achievements/AchievementList';
import Login from '../features/auth/Login';
import LoginCallback from '../features/auth/LoginCallback';
import Logout from '../features/auth/Logout';
import UserCreate from '../features/users/UserCreate';
import UserList from '../features/users/UserList';
import UserProfile from '../features/users/UserProfile';
import Home from '../pages/Home';

export enum Routes {
  AchievementsList = '/achievements/list',
  AchievementsCreate = '/achievements/create',
  Home = '/',
  Login = '/login',
  LoginCallback = '/login/callback',
  Logout = '/logout',
  UserProfile = '/profile',
  UserList = '/users/list',
  UserCreate = '/users/create',
}

const Router = (): JSX.Element => {
  return (
    <ReactRoutes>
      <Route path={Routes.Home} element={<Home />} />
      <Route path={Routes.LoginCallback} element={<LoginCallback />} />
      <Route path={Routes.Login} element={<Login />} />
      <Route path={Routes.Logout} element={<Logout />} />

      <Route element={<ProtectedRoute />}>
        <Route path={Routes.AchievementsList} element={<AchievementList />} />
        <Route path={Routes.AchievementsCreate} element={<AchievementCreate />} />
        <Route path={Routes.UserProfile} element={<UserProfile />} />
        <Route path={Routes.UserList} element={<UserList />} />
        <Route path={Routes.UserCreate} element={<UserCreate />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
