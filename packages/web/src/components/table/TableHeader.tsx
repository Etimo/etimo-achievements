import React from 'react';

const TableHeader: React.FC = ({ children, ...rest }) => {
  return (
    <th className="p-3 text-slate-200" {...rest}>
      {children}
    </th>
  );
};

export default TableHeader;
