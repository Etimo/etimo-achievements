import { faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner';

type Props = {
  id?: string;
  link: string;
  loading?: any;
  icon?: IconDefinition;
  className?: string;
};

const TrashButton: React.FC<Props> = ({ id, link, loading, icon, className }) => {
  return loading === id ? (
    <Spinner color="text-slate-700" />
  ) : (
    <Link id={id ?? 'trash-button'} to={link} className={className}>
      <FontAwesomeIcon icon={icon ?? faTrash} className="hover:text-slate-700" />
    </Link>
  );
};

export default TrashButton;
