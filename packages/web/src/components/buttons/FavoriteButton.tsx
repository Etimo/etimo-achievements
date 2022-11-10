import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTooltip } from '../../common/higher-order-components/with-tooltip';
import { mergeClasses } from '../../common/utils/merge-classes';

export type FavoriteButtonProps = {
  state: 'filled' | 'outlined';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const FavoriteButton = ({ onClick, state, disabled, className = '' }: FavoriteButtonProps) => {
  return (
    <FontAwesomeIcon
      onClick={onClick}
      icon={state === 'filled' ? faStar : (farStar as any)}
      size="lg"
      color={state === 'filled' ? '#eac54f' : 'black'}
      className={mergeClasses(
        `hover:opacity-60 ${disabled ? 'cursor-not-allowed hover:opacity-100' : 'cursor-pointer'}`,
        className
      )}
    />
  );
};

export const FavoriteButtonWithTooltip = withTooltip(FavoriteButton);
export default FavoriteButton;
