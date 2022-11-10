import React from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { CardRow } from '../cards';

type Props = {
  label: string;
  sublabel?: string;
  register: UseFormRegisterReturn;
  defaultValue?: boolean;
  error?: FieldError | undefined;
};

const FormCheckbox: React.VFC<Props> = ({ label, sublabel, register, defaultValue, error }) => {
  return (
    <CardRow label={label} sublabel={sublabel}>
      <input type="checkbox" {...register} defaultChecked={defaultValue} />
      {<span className="text-sm text-red-400">{error?.message}</span>}
    </CardRow>
  );
};

export default FormCheckbox;
