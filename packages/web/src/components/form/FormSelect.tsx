import { Select, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CardRow from '../cards/CardRow';

type Props = {
  label: string;
  text?: string;
  bindValue: any;
  onChange: (value: any) => void;
  options: { value: string; label: string; description?: string }[];
  nothingFound?: string;
};

interface ItemProps extends React.ComponentPropsWithRef<'div'> {
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ description, label, ...rest }: ItemProps, ref) => (
  <div ref={ref} {...rest}>
    <Text size="sm">{label}</Text>
    <Text color="dimmed" size="xs">
      {description}
    </Text>
  </div>
));

const FormSelect: React.FC<Props> = ({ label, text, bindValue, nothingFound, onChange, options }) => {
  return (
    <CardRow label={label}>
      <Select
        className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        searchable
        clearable
        placeholder={text ?? 'Select a value'}
        nothingFound={nothingFound ?? 'Nothing found'}
        data={options}
        itemComponent={SelectItem}
        filter={(value, item) =>
          item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.description?.toLowerCase().includes(value.toLowerCase().trim())
        }
        value={bindValue}
        onChange={onChange}
        styles={{ rightSection: { pointerEvents: 'none' } }}
        rightSection={
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        }
      />
    </CardRow>
  );
};

export default FormSelect;
