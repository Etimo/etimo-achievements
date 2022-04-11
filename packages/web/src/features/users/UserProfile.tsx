import { UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { EditButton } from '../../components/buttons';
import { Card, CardRow } from '../../components/cards';
import Header from '../../components/Header';
import { UserService } from './user-service';
import { profileSelector, updateUser } from './user-slice';
import UserProfileEditModal from './UserProfileEditModal';

const UserProfile: React.FC = () => {
  const userService = new UserService();
  const dispatch = useAppDispatch();
  const [editProfile, setEditProfile] = useState<UserDto>();
  const profile = useAppSelector(profileSelector);

  useEffect(() => {
    userService.getProfile().then((user) => {
      if (user) {
        dispatch(updateUser(user));
      }
    });
  }, []);

  if (!profile) return null;

  const closeModal = () => {
    setEditProfile(undefined);
  };

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditProfile(profile);
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Profile</Header>
      <Card>
        <CardRow label="Name">
          <div className="py-2 px-4 text-slate-700">
            {profile.name}
            <EditButton onClick={editHandler} className="float-right" />
          </div>
        </CardRow>
        <CardRow label="E-mail">
          <div className="py-2 px-4 text-slate-700">{profile.email}</div>
        </CardRow>
        <CardRow label="Slack handle">
          <div className="py-2 px-4 text-slate-700">{profile.slackHandle}</div>
        </CardRow>
      </Card>
      {editProfile && <UserProfileEditModal showModal={true} closeModal={closeModal} />}
    </div>
  );
};

export default UserProfile;
