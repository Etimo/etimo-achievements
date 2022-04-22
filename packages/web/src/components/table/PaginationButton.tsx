import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

type Props = {
  icon: IconDefinition;
  link: string;
  onClick: () => void;
  title: string;
  disabled: boolean;
};

const PaginationButton: React.FC<Props> = ({ icon, link, onClick, title, disabled }) => {
  return (
    <div className="inline-block w-8 h-8 text-center hover:cursor-pointer">
      {disabled ? (
        <FontAwesomeIcon icon={icon} className="text-xl text-slate-200" />
      ) : (
        <Link to={link} onClick={onClick} title={title} className="w-8 h-8 text-center hover:cursor-pointer">
          <FontAwesomeIcon icon={icon} className="text-xl text-slate-600 hover:text-slate-500" />
        </Link>
      )}
    </div>
  );
};

export default PaginationButton;
