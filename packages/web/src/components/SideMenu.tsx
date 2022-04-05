import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faAward, faRankingStar, faSignOut, faStar, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Menu, MenuItem, ProSidebar } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import useLoggedIn from '../common/hooks/use-logged-in';

const SideMenu = (): JSX.Element => {
  const isLoggedIn = useLoggedIn();

  return (
    <ProSidebar>
      {isLoggedIn ? (
        <>
          <Menu iconShape="round">
            <MenuItem icon={<FontAwesomeIcon icon={faUser} />}>
              Profile
              <Link to="/profile" />
            </MenuItem>
          </Menu>
          <Menu iconShape="circle">
            <MenuItem icon={<FontAwesomeIcon icon={faStar} />}>
              Achievements
              <Link to="/achievements" />
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faAward} />}>
              Awards
              <Link to="/awards" />
            </MenuItem>
            <MenuItem icon={<FontAwesomeIcon icon={faUsers} />}>
              Users
              <Link to="/users" />
            </MenuItem>
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
            <Link to="/logout" />
          </MenuItem>
        ) : (
          <MenuItem icon={<FontAwesomeIcon icon={faGoogle} />}>
            Sign in with Google
            <Link to="/login" />
          </MenuItem>
        )}
      </Menu>
    </ProSidebar>
  );
};

export default SideMenu;
