import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import CardRow from '../cards/CardRow';

type Props = {
  label: string;
  defaultValue?: any;
  register: UseFormRegisterReturn;
  error: FieldError | undefined;
};

const FormTextInput: React.FC<Props> = ({ defaultValue, label, register, error }) => {
  return (
    <CardRow label={label}>
      <input
        {...register}
        defaultValue={defaultValue}
        className="bg-slate-200 appearance-none border-2 border-slate-300 rounded w-full py-2 px-4 text-slate-700 leading-tight focus:outline-none focus:bg-white focus:border-slate-500"
      />
      {<span className="text-sm text-red-400">{error?.message}</span>}
    </CardRow>
  );
};

export default FormTextInput;
