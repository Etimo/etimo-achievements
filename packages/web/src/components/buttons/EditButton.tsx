import { faPen, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  id?: string;
  link: string;
  icon?: IconDefinition;
  className?: string;
};

const EditButton: React.FC<Props> = ({ id, link, icon, className }) => {
  return (
    <Link to={link} id={id ?? 'edit-button'} className={className}>
      <FontAwesomeIcon icon={icon ?? faPen} className="hover:text-slate-700" />
    </Link>
  );
};

export default EditButton;
