import React from 'react';

const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <td className="p-3 border border-slate-300">{children}</td>;
};

export default TableCell;
