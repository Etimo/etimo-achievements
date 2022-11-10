import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const PageSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <FontAwesomeIcon className="animate-spin" icon={faTrophy} size="5x" color="rgb(71 85 105)" />
    </div>
  );
};

export default PageSpinner;
