import React from 'react';
import { Navigate } from 'react-router';
import { Routes } from '../../app/Router';
import { useAppSelector } from '../../app/store';
import { userIdSelector } from '../auth/auth-slice';

const MyProfile = () => {
  const id = useAppSelector(userIdSelector);

  if (!id) return null;
  return <Navigate to={Routes.UserProfile.replace(':id', id)} />;
};

export default MyProfile;
