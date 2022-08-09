import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  state: 'filled' | 'outlined';
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
};

const FavoriteButton: React.FC<Props> = ({ onClick, state, disabled, title, className }) => {
  return (
    <FontAwesomeIcon
      title={title}
      onClick={onClick}
      icon={state === 'filled' ? faStar : (farStar as any)}
      size="lg"
      color={state === 'filled' ? '#eac54f' : 'black'}
      className={`${className ?? ''} hover:opacity-60 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    />
  );
};

export default FavoriteButton;
