import React from 'react';

const TableHeaderRow: React.FC = ({ children, ...rest }) => {
  return (
    <tr className="h-12 bg-slate-600 select-none" {...rest}>
      {children}
    </tr>
  );
};

export default TableHeaderRow;
