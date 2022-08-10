import { Tooltip } from '@mantine/core';
import React from 'react';
import { mergeClasses } from '../../common/utils/merge-classes';

type Props = {
  className?: string;
  tooltip?: string;
};

const TableCell: React.FC<Props> = ({ className, children, tooltip, ...rest }) => {
  return (
    <td className={mergeClasses('p-3 border border-slate-300', className)} {...rest}>
      {tooltip ? (
        <Tooltip label={tooltip} withArrow>
          <span>{children}</span>
        </Tooltip>
      ) : (
        children
      )}
    </td>
  );
};

export default TableCell;
