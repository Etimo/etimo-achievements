import React from 'react';

const TableColumn: React.FC = ({ children }) => {
  return <th className="p-3 text-slate-200">{children}</th>;
};

export default TableColumn;
