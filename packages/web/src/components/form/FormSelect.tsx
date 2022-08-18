import { Select, SelectItem } from '@mantine/core';
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

type Props = {
  text?: string;
  value: string | undefined;
  onChange: (value: any) => void;
  options: Option[];
  /** Affects how options are formatted */
  type?: 'multiline-image' | 'multiline' | 'single-line' | 'singleline-image';
  /** Custom filter function */
  filter?: (value: string, item: SelectItem) => boolean;
  /** Text to render when nothing is found */
  nothingFound?: string;
};

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  subtitle: string;
  type: Props['type'];
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

const FormSelect: React.FC<Props> = ({
  text,
  value,
  onChange,
  options,
  type = 'single-line',
  filter,
  children,
  nothingFound,
}) => {
  return (
    <Select
      searchable
      allowDeselect
      data={options.map((o) => ({ ...o, type }))}
      nothingFound={nothingFound ?? 'No items'}
      value={value}
      itemComponent={SelectItemComponent}
      onChange={onChange}
      placeholder={text}
      styles={{ rightSection: { pointerEvents: 'none' } }}
      maxDropdownHeight={500}
      filter={
        filter ??
        ((query, { label, subtitle }) =>
          label?.toLowerCase().includes(query.toLowerCase().trim()) ||
          subtitle?.toLowerCase().includes(query.toLowerCase().trim()))
      }
      rightSection={
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      }
    />
  );
};

interface WithRowProps {
  label: string;
}

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
export default FormSelect;
