import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect, MultiSelectValueProps, Select, SelectItem } from '@mantine/core';
import React, { forwardRef } from 'react';
import Avatar from '../Avatar';
import CardRow from '../cards/CardRow';

type Option = {
  value: string;
  label: string;
  subtitle?: string;
  image?: string;
  group?: string;
};

type BaseProps = {
  placeholder?: string;
  onChange: (value: any) => void;
  options: Option[];
  /** Affects how options are formatted */
  type?: 'multiline-image' | 'multiline' | 'single-line' | 'singleline-image';
  /** Text to render when nothing is found */
  nothingFound?: string;
};

type SelectProps = {
  value: string | undefined;
  /** Custom filter function */
  filter?: (value: string, item: SelectItem) => boolean;
  allowDeselect?: boolean;
} & BaseProps;

type MultiSelectProps = {
  value: string[] | undefined;
  /** Custom filter function */
  filter?: (value: string, selected: boolean, item: SelectItem) => boolean;
} & BaseProps;

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  subtitle: string;
  type: BaseProps['type'];
}

const SelectItemComponent = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, subtitle, type, ...rest }: ItemProps, ref) => (
    <div {...rest} ref={ref} className="flex flex-column items-center p-2 hover:bg-slate-100 cursor-pointer w-full">
      {(type === 'multiline-image' || type === 'singleline-image') && <Avatar src={image} size={40} />}
      <div className="py-0 px-2 w-full">
        <div className="font-medium">{label}</div>
        {(type === 'multiline-image' || type === 'multiline') && subtitle && (
          <div className="text-xs text-gray-500 font-thin">{subtitle}</div>
        )}
      </div>
    </div>
  )
);

type MultiSelectValueComponentProps = {
  value: string;
  image: string;
} & MultiSelectValueProps;

const MultiSelectValueComponent = ({ value, label, image, onRemove, ...rest }: MultiSelectValueComponentProps) => {
  return (
    <div
      {...rest}
      style={{
        padding: '2px 2px',
        border: 'solid 2px #cbd5e1',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {label}
      <span style={{ padding: '0 3px', cursor: 'pointer' }} onMouseDown={onRemove}>
        <FontAwesomeIcon icon={faXmark} />
      </span>
    </div>
  );
};

const filterFn = (query: string, item: SelectItem): boolean => {
  return (
    item.label?.toLowerCase().includes(query.toLowerCase().trim()) ||
    item.subtitle?.toLowerCase().includes(query.toLowerCase().trim())
  );
};

const rightIcon = (
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
    </svg>
  </div>
);

// TODO: export const instead of default
const FormSelect: React.FC<SelectProps> = ({
  placeholder,
  value,
  onChange,
  options,
  type = 'single-line',
  filter,
  nothingFound,
  allowDeselect = true,
}) => {
  return (
    <Select
      searchable
      allowDeselect={allowDeselect}
      data={options.map((o) => ({ ...o, type }))}
      nothingFound={nothingFound ?? 'No items'}
      value={value}
      itemComponent={SelectItemComponent}
      onChange={onChange}
      placeholder={placeholder}
      styles={{ rightSection: { pointerEvents: 'none' } }}
      maxDropdownHeight={500}
      filter={filter ?? filterFn}
      rightSection={rightIcon}
    />
  );
};

export const FormMultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  value,
  onChange,
  options,
  type = 'single-line',
  filter,
  nothingFound,
}) => {
  return (
    <MultiSelect
      data={options.map((o) => ({ ...o, type }))}
      searchable
      value={value}
      onChange={onChange}
      nothingFound={nothingFound ?? 'No items'}
      itemComponent={SelectItemComponent}
      valueComponent={MultiSelectValueComponent}
      placeholder={placeholder}
      styles={{ rightSection: { pointerEvents: 'none' } }}
      maxDropdownHeight={500}
      filter={filter ?? ((query, selected, item) => !selected && filterFn(query, item))}
      rightSection={rightIcon}
    />
  );
};

interface WithRowProps {
  label: string;
}

// TODO: Move
const withRow =
  <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithRowProps> =>
  ({ children, label, ...props }) => {
    return (
      <CardRow label={label}>
        <div className="w-full">
          <div className="relative">
            <Component {...(props as P)} />
          </div>
        </div>
        {children}
      </CardRow>
    );
  };

export const FormSelectRow = withRow(FormSelect);
export const FormMultiSelectRow = withRow(FormMultiSelect);
export default FormSelect;
