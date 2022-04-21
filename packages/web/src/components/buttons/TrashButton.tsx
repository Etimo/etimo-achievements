import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Spinner from '../Spinner';

type Props = {
  id: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: any;
  icon?: IconDefinition;
  className?: string;
};

const TrashButton: React.FC<Props> = ({ id, onClick, loading, icon, className }) => {
  return (
    <button id={id} onClick={onClick} className={className}>
      {loading === id ? (
        <Spinner color="text-slate-700" />
      ) : (
        <FontAwesomeIcon icon={icon ?? faTrash} className="hover:text-slate-700" />
      )}
    </button>
  );
};

export default TrashButton;
