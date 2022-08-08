import { faGoogle, faSlack } from '@fortawesome/free-brands-svg-icons';
import {
  faHandSparkles,
  faList,
  faRankingStar,
  faShield,
  faSignOut,
  faSquarePlus,
  faStar,
  faTrophy,
  faUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Menu, MenuItem, ProSidebar, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import { Routes } from '../app/Router';
import { useAppSelector } from '../app/store';
import { userIdSelector } from '../features/auth/auth-slice';
import useLoggedIn from '../features/auth/hooks/use-logged-in';
import useLoginState from '../features/auth/hooks/use-login-state';
import RequirePermission from './RequirePermission';
const version = require('../version.json');

const SideMenu: React.FC = () => {
  const loggedIn = useLoggedIn();
  const loginState = useLoginState();
  const userId = useAppSelector(userIdSelector);

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
                <Link to={Routes.MyProfile} />
              </MenuItem>
            </Menu>
          </RequirePermission>
          <Menu iconShape="circle">
            <SubMenu title="Achievements" icon={<FontAwesomeIcon icon={faStar} />}>
              <RequirePermission create="achievements">
                <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                  Create achievement
                  <Link to={Routes.AchievementCreate} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission create="awards">
                <MenuItem icon={<FontAwesomeIcon icon={faHandSparkles} />}>
                  Give achievement
                  <Link to={Routes.AwardGive} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission read="achievements">
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List all achievements
                  <Link to={Routes.AchievementList} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission read="awards">
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List given achivements
                  <Link to={Routes.AwardList} />
                </MenuItem>
              </RequirePermission>
            </SubMenu>
            <SubMenu title="Badges" icon={<FontAwesomeIcon icon={faShield} />}>
              <RequirePermission create="badges">
                <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                  Create badge
                  <Link to={Routes.BadgeCreate} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission create="badge-awards">
                <MenuItem icon={<FontAwesomeIcon icon={faHandSparkles} />}>
                  Give badge
                  <Link to={Routes.BadgeGive} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission read="badges">
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List all badges
                  <Link to={Routes.BadgeList} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission read="badge-awards">
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List given badges
                  <Link to={Routes.BadgeAwardsList} />
                </MenuItem>
              </RequirePermission>
            </SubMenu>
            <SubMenu title="Trophies" icon={<FontAwesomeIcon icon={faTrophy} />}>
              <RequirePermission create="awards">
                <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                  Create trophy
                  <Link to={''} />
                </MenuItem>
              </RequirePermission>
              <RequirePermission read="awards">
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List all Trophies
                  <Link to={''} />
                </MenuItem>
              </RequirePermission>
            </SubMenu>
            <RequirePermission read="users">
              <SubMenu title="Users" icon={<FontAwesomeIcon icon={faUsers} />}>
                <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                  List users
                  <Link to={Routes.UserList} />
                </MenuItem>
                <RequirePermission update="users">
                  <MenuItem icon={<FontAwesomeIcon icon={faSlack} />}>
                    Manual Slack Sync
                    <Link to={Routes.UserSlackSync} />
                  </MenuItem>
                </RequirePermission>
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
