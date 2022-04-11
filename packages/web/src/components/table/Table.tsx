import React from 'react';

const Table: React.FC = ({ children }) => {
  return <table className="w-full table-auto rounded-md border-collapse border border-slate-500">{children}</table>;
};

export default Table;
