import React from 'react';

const TableColumn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <th className="text-slate-200">{children}</th>;
};

export default TableColumn;
