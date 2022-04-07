import { faSnowflake, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  loading?: boolean;
  icon?: IconDefinition;
};

const Spinner: React.FC<Props> = ({ loading, icon }) => {
  // If no loading is provided, always spin!
  if (loading === undefined) {
    loading = true;
  }

  return <>{loading && <FontAwesomeIcon icon={icon ?? faSnowflake} className="animate-spin text-white mr-2" />}</>;
};

export default Spinner;
