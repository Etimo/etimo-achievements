import React from 'react';

type Props = {
  label?: string;
  sublabel?: string;
};

const CardRow: React.FC<Props> = ({ label, sublabel, children }) => {
  return (
    <div className="md:flex md:items-center mb-5">
      <div className="md:w-1/3">
        {label && <label className="block text-slate-500 font-bold md:text-right mb-1 md:mb-0 pr-4">{label}</label>}
        {sublabel && <label className="block text-xs text-slate-500 md:text-right mb-1 md:mb-0 pr-4">{sublabel}</label>}
      </div>
      <div className="md:w-2/3 flex items-center">{children}</div>
    </div>
  );
};

export default CardRow;
