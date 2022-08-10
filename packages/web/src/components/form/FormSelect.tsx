import React, { useState } from 'react';
import Select from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import Avatar from '../Avatar';
import CardRow from '../cards/CardRow';

type Option = {
  value: string;
  label: string;
  subtitle?: string;
  image?: string;
};

type Props = {
  label: string;
  text?: string;
  value: string | undefined;
  onChange: (value: any) => void;
  options: Option[];
  /** Affects how options are formatted */
  type?: 'multiline-image' | 'multiline' | 'single-line' | 'singleline-image';
  /** Custom filter function */
  filter?: (option: FilterOptionOption<Option>, inputValue: string) => boolean;
};

const FormSelect: React.FC<Props> = ({
  label,
  text,
  value,
  onChange,
  options,
  type = 'single-line',
  filter,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <CardRow label={label}>
      <div className="w-full">
        <div className="relative">
          <Select
            menuIsOpen={open}
            onMenuOpen={() => setOpen(true)}
            onMenuClose={() => setOpen(false)}
            value={options.find((o) => o.value === value)}
            placeholder={text}
            className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            options={options}
            noOptionsMessage={() => 'No achievements'}
            filterOption={
              filter ??
              ((option, query) =>
                option.label.toLowerCase().includes(query.toLowerCase().trim()) ||
                (option.data.subtitle ?? '').toLowerCase().includes(query.toLowerCase().trim()))
            }
            components={{
              DropdownIndicator: undefined,
              Option: ({ data, isSelected }) => {
                return (
                  <MultilineOption
                    option={data}
                    onClick={(value) => {
                      isSelected ? onChange('') : onChange(value);
                      setOpen(false);
                    }}
                    type={type}
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
      {children}
    </CardRow>
  );
};

interface MultilineOptionProps {
  option: Option;
  onClick: (value: string) => void;
  type: Props['type'];
}

const MultilineOption = ({ option, onClick, type }: MultilineOptionProps) => {
  const { label, value, image, subtitle } = option;
  return (
    <div className="flex flex-column items-center p-2 hover:bg-slate-100 cursor-pointer" onClick={() => onClick(value)}>
      {(type === 'multiline-image' || type === 'singleline-image') && <Avatar src={image} size={40} />}
      <div className="py-1 px-2">
        <div className="font-medium">{label}</div>
        {(type === 'multiline' || type === 'multiline-image') && (
          <div className="text-xs text-gray-500 font-thin">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

export default FormSelect;
