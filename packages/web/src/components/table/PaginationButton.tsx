import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  icon: IconDefinition;
  link: string;
  title: string;
  disabled: boolean;
};

const PaginationButton: React.FC<Props> = ({ icon, link, title, disabled }) => {
  return disabled ? (
    <span className="w-8 h-8 p-2 text-center">
      <FontAwesomeIcon icon={icon} className="text-xl text-slate-200" />
    </span>
  ) : (
    <Link to={link} title={title} className="w-8 h-8 p-2 text-center hover:cursor-pointer">
      <FontAwesomeIcon icon={icon} className="text-xl text-slate-600 hover:text-slate-500" />
    </Link>
  );
};

export default PaginationButton;
