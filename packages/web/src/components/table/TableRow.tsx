import React from 'react';

const TableRow: React.FC<{ key: any }> = ({ key, children }) => {
  return (
    <tr key={key} className="h-8 bg-slate-300">
      {children}
    </tr>
  );
};

export default TableRow;
