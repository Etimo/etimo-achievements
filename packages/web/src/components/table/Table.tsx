import React from 'react';

const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <table className="table-auto m-3 rounded-md border-collapse border border-slate-500">{children}</table>
    </>
  );
};

export default Table;
