import React from 'react';
import CardRow from '../cards/CardRow';

type Props = {
  label: string;
  selectText?: string;
};

const FormDropdown: React.FC<Props> = ({ label, selectText, children }) => {
  return (
    <CardRow label={label}>
      <div className="xl:w-96">
        <select
          className="form-select
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        >
          <option selected>{selectText ?? 'Select a value'}</option>
          {children}
        </select>
      </div>
    </CardRow>
  );
};

export default FormDropdown;
