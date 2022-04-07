import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  label: string;
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
};

const TextInput: React.FC<Props> = ({ label, register, error }) => {
  return (
    <div className="md:flex md:items-center mb-6">
      <div className="md:w-1/3">
        <label className="block text-slate-500 font-bold md:text-right mb-1 md:mb-0 pr-4">{label}</label>
      </div>
      <div className="md:w-2/3">
        <input
          {...register}
          className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-700 leading-tight focus:outline-none focus:bg-white focus:border-slate-500"
        />
        {<span className="text-sm text-red-400">{error?.message}</span>}
      </div>
    </div>
  );
};

export default TextInput;
