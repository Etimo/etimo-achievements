import React from 'react';

const TableBody: React.FC = ({ children, ...rest }) => {
  return <tbody {...rest}>{children}</tbody>;
};

export default TableBody;
