import React from 'react';

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <thead>
        <tr className="h-12 bg-slate-600">{children}</tr>
      </thead>
    </>
  );
};

export default TableHeader;
