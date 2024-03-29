import React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import NotFound from '../components/404/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AchievementCreate from '../features/achievements/AchievementCreate';
import AchievementList from '../features/achievements/AchievementList';
import Login from '../features/auth/Login';
import LoginCallback from '../features/auth/LoginCallback';
import Logout from '../features/auth/Logout';
import AwardGive from '../features/awards/AwardGive';
import AwardList from '../features/awards/AwardList';
import BadgeAwardGive from '../features/badge-awards/BadgeAwardGive';
import BadgeAwardsList from '../features/badge-awards/BadgeAwardsList';
import BadgeCreate from '../features/badges/BadgeCreate';
import BadgeList from '../features/badges/BadgeList';
import Highscores from '../features/highscore/Highscore';
import { SeasonCreate, SeasonList } from '../features/seasons';
import MyProfile from '../features/user-profile/MyProfile';
import UserProfile from '../features/user-profile/UserProfile';
import UserCreate from '../features/users/UserCreate';
import UserList from '../features/users/UserList';
import UserSlackSync from '../features/users/UserSlackSync';
import Home from '../pages/Home';

export enum Routes {
  AchievementList = '/achievements/list',
  AchievementCreate = '/achievements/create',
  AwardList = '/awards/list',
  AwardGive = '/awards/give',
  Home = '/',
  Login = '/login',
  LoginCallback = '/login/callback',
  Logout = '/logout',
  MyProfile = '/me',
  UserProfile = '/profile/:id',
  UserList = '/users/list',
  UserCreate = '/users/create',
  UserSlackSync = '/users/slack-sync',
  Highscores = '/highscores',
  BadgeGive = '/badges/give',
  BadgeCreate = '/badges/create',
  BadgeList = '/badges/list',
  BadgeAwardsList = '/badges/list-awards',
  SeasonCreate = '/seasons/create',
  SeasonList = '/seasons/list',
}

const Router = (): JSX.Element => {
  return (
    <ReactRoutes>
      <Route path={Routes.Home} element={<Home />} />
      <Route path={Routes.LoginCallback} element={<LoginCallback />} />
      <Route path={Routes.Login} element={<Login />} />
      <Route path={Routes.Logout} element={<Logout />} />

      <Route element={<ProtectedRoute />}>
        <Route path={Routes.AchievementList} element={<AchievementList />} />
        <Route path={Routes.AchievementCreate} element={<AchievementCreate />} />
        <Route path={Routes.AwardList} element={<AwardList />} />
        <Route path={Routes.AwardGive} element={<AwardGive />} />
        <Route path={Routes.MyProfile} element={<MyProfile />} />
        <Route path={Routes.UserProfile} element={<UserProfile />} />
        <Route path={Routes.UserList} element={<UserList />} />
        <Route path={Routes.UserCreate} element={<UserCreate />} />
        <Route path={Routes.UserSlackSync} element={<UserSlackSync />} />
        <Route path={Routes.Highscores} element={<Highscores />} />
        <Route path={Routes.BadgeAwardsList} element={<BadgeAwardsList />} />
        <Route path={Routes.BadgeList} element={<BadgeList />} />
        <Route path={Routes.BadgeCreate} element={<BadgeCreate />} />
        <Route path={Routes.BadgeGive} element={<BadgeAwardGive />} />
        <Route path={Routes.SeasonCreate} element={<SeasonCreate />} />
        <Route path={Routes.SeasonList} element={<SeasonList />} />
        {/* Should be put last */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </ReactRoutes>
  );
};

export default Router;
