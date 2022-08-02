import { Tooltip } from '@mui/material';
import React from 'react';
import { mergeClasses } from '../../common/utils/merge-classes';

type Props = {
  className?: string;
  tooltip?: string;
};

const TableCell: React.FC<Props> = ({ className, children, tooltip, ...rest }) => {
  const content = (
    <td className={mergeClasses('p-3 border border-slate-300', className)} {...rest}>
      {children}
    </td>
  );

  // Wrap cell in tooltip
  if (tooltip) {
    return <Tooltip title={tooltip}>{content}</Tooltip>;
  }

  return content;
};

export default TableCell;
