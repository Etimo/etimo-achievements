import React from 'react';

const TableRow: React.FC = ({ children }) => {
  return <tr className="h-8 bg-slate-300">{children}</tr>;
};

export default TableRow;
