import React from 'react';

const TableRow: React.FC = ({ children, ...rest }) => {
  return (
    <tr className="h-8 bg-slate-300" {...rest}>
      {children}
    </tr>
  );
};

export default TableRow;
