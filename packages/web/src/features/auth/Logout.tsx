import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/store';
import { setLoggedOut } from './auth-slice';

const Logout = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoggedOut());
    navigate('/');
  });

  return <></>;
};

export default Logout;
