import { UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { EditButton } from '../../components/buttons';
import { Card, CardRow } from '../../components/cards';
import Header from '../../components/Header';
import { myUserIdSelector } from '../auth/auth-slice';
import { UserService } from './user-service';
import UserEditModal from './UserEditModal';

const UserProfile: React.FC = () => {
  const userId = useAppSelector(myUserIdSelector);
  const userService = new UserService();
  const [user, setUser] = useState<UserDto>();
  const [editUser, setEditUser] = useState<UserDto>();

  useEffect(() => {
    userId &&
      userService.fetch(userId).then((user) => {
        setUser(user);
      });
  }, [userId]);

  if (!userId || !user) return null;

  const closeModal = () => {
    setEditUser(undefined);
  };

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditUser(user);
  };

  return (
    <>
      <Header>Profile</Header>
      <Card>
        <CardRow>
          <EditButton onClick={editHandler} className="float-right" />
        </CardRow>
        <CardRow label="Name">{user?.name}</CardRow>
        <CardRow label="E-mail">{user?.email}</CardRow>
        <CardRow label="Slack handle">{user?.slackHandle}</CardRow>
      </Card>
      {editUser && <UserEditModal userId={userId} showModal={true} closeModal={closeModal} />}
    </>
  );
};

export default UserProfile;
