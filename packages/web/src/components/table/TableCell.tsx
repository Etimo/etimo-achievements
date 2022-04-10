import React from 'react';
import { mergeClasses } from '../../common/utils/merge-classes';

type Props = {
  className?: string;
};

const TableCell: React.FC<Props> = ({ className, children }) => {
  return <td className={mergeClasses('p-3 border border-slate-300', className)}>{children}</td>;
};

export default TableCell;
