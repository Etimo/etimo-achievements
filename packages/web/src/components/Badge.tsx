import { Role } from '@etimo-achievements/types';
import { Badge as MantineBadge } from '@mantine/core';
import React from 'react';

type Props = {
  text: string;
  role: Role;
};

const RoleBadge: React.VFC<Props> = ({ text, role }) => {
  const getColor = (r: Role) => {
    switch (r) {
      case 'admin':
        return 'teal';
      case 'moderator':
        return 'cyan';
      case 'user':
        return 'blue';
      default:
        return 'red';
    }
  };

  return <MantineBadge color={getColor(role)}>{text}</MantineBadge>;
};

export default RoleBadge;
