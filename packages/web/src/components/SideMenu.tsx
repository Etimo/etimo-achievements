import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faAward,
  faHandSparkles,
  faList,
  faRankingStar,
  faSignOut,
  faSquarePlus,
  faStar,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Menu, MenuItem, ProSidebar, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import { Routes } from '../app/Router';
import useLoggedIn from '../features/auth/hooks/use-logged-in';
import useLoginState from '../features/auth/hooks/use-login-state';
import RequirePermission from './RequirePermission';
const version = require('../version.json');

const SideMenu: React.FC = () => {
  const loggedIn = useLoggedIn();
  const loginState = useLoginState();

  const date = new Date(version.date).toISOString().split('T')[0].replace(/-/g, '');
  const versionInfo = `${date}.${version.build_number}`;

  return (
    <ProSidebar>
      {loggedIn ? (
        <>
          <RequirePermission read="profile">
            <Menu iconShape="round">
              <MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
                Profile
                <Link to={Routes.UserProfile} />
              </MenuItem>
            </Menu>
          </RequirePermission>
          <Menu iconShape="circle">
            <RequirePermission read="achievements">
              <SubMenu title="Achievements" icon={<FontAwesomeIcon icon={faStar} />}>
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List achievements
                  <Link to={Routes.AchievementList} />
                </MenuItem>
                <RequirePermission create="achievements">
                  <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                    Create achievement
                    <Link to={Routes.AchievementCreate} />
                  </MenuItem>
                </RequirePermission>
              </SubMenu>
            </RequirePermission>
            <RequirePermission read="awards">
              <SubMenu title="Awards" icon={<FontAwesomeIcon icon={faAward} />}>
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List awards
                  <Link to={Routes.AwardList} />
                </MenuItem>
                <RequirePermission create="awards">
                  <MenuItem icon={<FontAwesomeIcon icon={faHandSparkles} />}>
                    Give award
                    <Link to={Routes.AwardGive} />
                  </MenuItem>
                </RequirePermission>
              </SubMenu>
            </RequirePermission>
            <RequirePermission read="users">
              <SubMenu title="Users" icon={<FontAwesomeIcon icon={faUsers} />}>
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List users
                  <Link to={Routes.UserList} />
                </MenuItem>
                <RequirePermission create="users">
                  <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                    Create user
                    <Link to={Routes.UserCreate} />
                  </MenuItem>
                </RequirePermission>
              </SubMenu>
            </RequirePermission>
            <RequirePermission read="highscore">
              <MenuItem icon={<FontAwesomeIcon icon={faRankingStar} />}>
                Highscores
                <Link to={Routes.Highscores} />
              </MenuItem>
            </RequirePermission>
          </Menu>
        </>
      ) : null}
      <Menu iconShape="square">
        {loggedIn ? (
          <MenuItem icon={<FontAwesomeIcon icon={faSignOut} />}>
            Log out
            <Link to={Routes.Logout} />
          </MenuItem>
        ) : (
          <MenuItem icon={<FontAwesomeIcon icon={faGoogle} />}>
            Sign in with Google
            <Link to={Routes.Login + '?state=' + loginState} />
          </MenuItem>
        )}
      </Menu>
      <RequirePermission scope="admin">
        <div className="absolute bottom-0 left-0 p-2 text-xs">v{versionInfo}</div>
      </RequirePermission>
    </ProSidebar>
  );
};

export default SideMenu;
