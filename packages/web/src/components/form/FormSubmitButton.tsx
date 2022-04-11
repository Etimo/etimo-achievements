import React from 'react';
import { CardRow } from '../cards';
import Spinner from '../Spinner';

type Props = {
  label: string;
  loading: boolean;
};

const FormSubmitButton: React.FC<Props> = ({ label, loading }) => {
  return (
    <CardRow>
      <button
        type="submit"
        value={label}
        className="shadow w-1/2 bg-slate-500 hover:bg-slate-600 hover:cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        <Spinner loading={loading} />
        {label}
      </button>
    </CardRow>
  );
};

export default FormSubmitButton;
