import React from 'react';

type Props = {
  className?: string;
  children: React.ReactNode;
};

const TableCell: React.FC<Props> = ({ className, children }) => {
  let classes = 'p-3 border border-slate-300';

  if (className) {
    classes += ` ${className}`;
  }

  return <td className={classes}>{children}</td>;
};

export default TableCell;
