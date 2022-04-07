import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  label: string;
  loading: boolean;
};

const SubmitButton: React.FC<Props> = ({ label, loading }) => {
  return (
    <div className="md:flex md:items-center">
      <div className="md:w-1/3 text-right pr-6"></div>
      <div className="md:w-2/3">
        <button
          type="submit"
          value={label}
          className="shadow w-1/2 bg-slate-500 hover:bg-slate-600 hover:cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          {loading && <FontAwesomeIcon icon={faSnowflake} className="animate-spin text-white mr-2" />}
          {label}
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
