import { faPen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  id?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconDefinition;
  className?: string;
};

const EditButton: React.FC<Props> = ({ id, onClick, icon, className }) => {
  return (
    <button id={id ?? 'edit-button'} className={className} onClick={onClick}>
      <FontAwesomeIcon icon={icon ?? faPen} className="hover:text-slate-700" />
    </button>
  );
};

export default EditButton;
