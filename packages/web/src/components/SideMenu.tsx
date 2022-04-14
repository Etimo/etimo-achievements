import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faAward,
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
import useLoggedIn from '../common/hooks/use-logged-in';

const SideMenu: React.FC = () => {
  const isLoggedIn = useLoggedIn();

  return (
    <ProSidebar>
      {isLoggedIn ? (
        <>
          <Menu iconShape="round">
            <MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
              Profile
              <Link to={Routes.UserProfile} />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <SubMenu title="Achievements" icon={<FontAwesomeIcon icon={faStar} />}>
              <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                List achievements
                <Link to={Routes.AchievementList} />
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                Create achievement
                <Link to={Routes.AchievementCreate} />
              </MenuItem>
            </SubMenu>
            <MenuItem icon={<FontAwesomeIcon icon={faAward} />}>
              Awards
              <Link to={Routes.AwardList} />
            </MenuItem>
            <SubMenu title="Users" icon={<FontAwesomeIcon icon={faUsers} />}>
              <MenuItem icon={<FontAwesomeIcon icon={faList} />}>
                List users
                <Link to={Routes.UserList} />
              </MenuItem>
              <MenuItem icon={<FontAwesomeIcon icon={faSquarePlus} />}>
                Create user
                <Link to={Routes.UserCreate} />
              </MenuItem>
            </SubMenu>
            <MenuItem icon={<FontAwesomeIcon icon={faRankingStar} />}>
              Ranking
              <Link to="/ranking" />
            </MenuItem>
          </Menu>
        </>
      ) : null}
      <Menu iconShape="square">
        {isLoggedIn ? (
          <MenuItem icon={<FontAwesomeIcon icon={faSignOut} />}>
            Log out
            <Link to={Routes.Logout} />
          </MenuItem>
        ) : (
          <MenuItem icon={<FontAwesomeIcon icon={faGoogle} />}>
            Sign in with Google
            <Link to={Routes.Login} />
          </MenuItem>
        )}
      </Menu>
    </ProSidebar>
  );
};

export default SideMenu;
