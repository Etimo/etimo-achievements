import React from 'react';

type Props = {
  onClick?: () => void;
};

const TableHeader: React.FC<Props> = ({ onClick, children, ...rest }) => {
  return (
    <th className="p-3 text-slate-200 text-left" onClick={onClick} {...rest}>
      {children}
    </th>
  );
};

export default TableHeader;
