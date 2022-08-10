import React from 'react';
import Avatar from '../Avatar';

const NameAvatarUserCell: React.FC<{ name: string; image: string }> = ({ name, image }) => (
  <span className="flex items-center">
    <Avatar src={image} size={25} />
    &nbsp;
    <span className="whitespace-nowrap">{name}</span>
  </span>
);

export default NameAvatarUserCell;
