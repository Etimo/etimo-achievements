import React from 'react';

type Props = {
  label?: string;
};

const CardRow: React.FC<Props> = ({ label, children }) => {
  return (
    <div className="md:flex md:items-center mb-6 px-6">
      <div className="md:w-1/3">
        {label && <label className="block text-slate-500 font-bold md:text-right mb-1 md:mb-0 pr-4">{label}</label>}
      </div>
      <div className="md:w-2/3">{children}</div>
    </div>
  );
};

export default CardRow;
