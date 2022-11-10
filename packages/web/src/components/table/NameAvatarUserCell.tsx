import { UserDto } from '@etimo-achievements/common';
import React from 'react';
import { Link } from 'react-router-dom';
import { Routes } from '../../app/Router';
import Avatar from '../Avatar';

const NameAvatarUserCell: React.FC<{ user: UserDto }> = ({ user }) => {
  const { id, name, image } = user;
  return (
    <span className="flex items-center">
      <Avatar src={image} size={25} />
      &nbsp;
      <span className="whitespace-nowrap">
        <Link to={Routes.UserProfile.replace(':id', id)} className="font-medium hover:underline">
          {name}
        </Link>
      </span>
    </span>
  );
};

export default NameAvatarUserCell;
