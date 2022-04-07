import React from 'react';

const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <tbody>{children}</tbody>
    </>
  );
};

export default TableBody;
