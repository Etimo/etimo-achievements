import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTooltip } from '../../common/higher-order-components/with-tooltip';

export const ClearFilters = withTooltip<{ onClick: () => void; disabled: boolean }>(
  ({ onClick, disabled }) => {
    return (
      <FontAwesomeIcon
        icon={faFilterCircleXmark}
        className={disabled ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}
        onClick={onClick}
      />
    );
  },
  { className: 'flex items-center' }
);
