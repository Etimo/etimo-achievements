import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { logout } from './authSlice';

const Logout = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    localStorage.setItem('loggedIn', 'false');
    dispatch(logout());
    navigate('/');
  });

  return <></>;
};

export default Logout;
