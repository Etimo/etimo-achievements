import React from 'react';
import { useAppSelector } from '../app/store';
import { authSelector } from '../features/auth/auth-slice';

const Profile = (): JSX.Element => {
  const auth = useAppSelector(authSelector);

  return (
    <>
      <h1 className="text-3xl text-center">Profile</h1>
      {auth.isAuthenticated ? (
        <h2 className="text-3xl text-center">{auth.userInfo?.name}</h2>
      ) : (
        <h2 className="text-3xl text-center">Not logged in!</h2>
      )}
    </>
  );
};

export default Profile;
