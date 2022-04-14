import { faSnowflake, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  loading?: boolean;
  icon?: IconDefinition;
  color?: string;
};

const Spinner: React.FC<Props> = ({ loading, icon, color }) => {
  // If no loading is provided, always spin!
  if (loading === undefined) {
    loading = true;
  }

  return (
    <>
      {loading && (
        <FontAwesomeIcon icon={icon ?? faSnowflake} className={'animate-spin mr-2' + color ?? 'text-white'} />
      )}
    </>
  );
};

export default Spinner;
