import React from 'react';
import Select from 'react-select';
import CardRow from '../cards/CardRow';

type Props = {
  label: string;
  text?: string;
  bindValue: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string; subtitle?: string }[];
};

const FormSelect: React.FC<Props> = ({ label, text, bindValue, onChange, options }) => {
  return (
    <CardRow label={label}>
      <div className="w-full">
        <div className="relative">
          <Select
            placeholder={text}
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            options={options}
            noOptionsMessage={() => 'No achievements'}
            components={{
              DropdownIndicator: undefined,
              Option: ({ data, setValue }) => {
                return (
                  <MultilineOption
                    value={data.value}
                    title={data.label}
                    subtitle={data.subtitle}
                    onClick={(value: string) => setValue({ value, label: data.label }, 'select-option')}
                  />
                );
              },
            }}
            onChange={(value) => onChange(value?.value)}
          />
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

interface MultilineOptionProps {
  value: string;
  title: string;
  subtitle?: string;
  onClick: (value: string) => void;
}

const MultilineOption = ({ value, title, subtitle, onClick }: MultilineOptionProps) => {
  return (
    <div className="hover:bg-blue-300 py-1 px-2 cursor-pointer" onClick={() => onClick(value)}>
      <div className="font-medium">{title}</div>
      <div className="text-xs text-gray-500 font-thin">{subtitle}</div>
    </div>
  );
};

export default FormSelect;
