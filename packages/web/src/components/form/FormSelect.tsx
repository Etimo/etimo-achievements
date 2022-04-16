import React, { useState } from 'react';
import CardRow from '../cards/CardRow';

type Props = {
  label: string;
  text?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};

const FormSelect: React.FC<Props> = ({ label, text, onChange, options }) => {
  const [value, setValue] = useState(text ?? 'Select a value');

  return (
    <CardRow label={label}>
      <div className="w-full">
        <div className="relative">
          <select
            className="block appearance-none w-full bg-white-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e);
            }}
          >
            <option key="" value="">
              {text ?? 'Select a value'}
            </option>
            {options?.map((child) => (
              <option key={child.value} value={child.value}>
                {child.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </CardRow>
  );
};

export default FormSelect;
