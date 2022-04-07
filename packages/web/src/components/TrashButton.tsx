import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Spinner from './Spinner';

type Props = {
  id: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
  icon?: IconDefinition;
};

const TrashButton: React.FC<Props> = ({ id, onClick, loading, icon }) => {
  // If no loading is provided, always spin!
  if (loading === undefined) {
    loading = true;
  }

  return (
    <button id={id} onClick={onClick}>
      {loading ? <Spinner /> : <FontAwesomeIcon icon={icon ?? faTrash} className="hover:text-slate-700" />}
    </button>
  );
};

export default TrashButton;
