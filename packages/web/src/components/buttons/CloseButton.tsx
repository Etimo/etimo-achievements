import { faClose, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconDefinition;
};

const CloseButton: React.FC<Props> = ({ onClick, icon }) => {
  return (
    <button onClick={onClick} className="float-right mr-4">
      <FontAwesomeIcon icon={icon ?? faClose} className="hover:text-slate-700" />
    </button>
  );
};

export default CloseButton;
