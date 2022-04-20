import { uuid } from '@etimo-achievements/common';
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { TableCell, TableRow } from '.';

type Props = {
  columns?: number;
  rows?: number;
};

const SkeletonTableRow: React.FC<Props> = ({ columns, rows, children }) => {
  return (
    <SkeletonTheme baseColor="#475569" highlightColor="#E2E8F0">
      {[...Array(rows).keys()].map(() => (
        <TableRow key={uuid()}>
          {[...Array(columns).keys()].map(() => (
            <TableCell key={uuid()}>
              <Skeleton className="bg-color-black" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </SkeletonTheme>
  );
};

export default SkeletonTableRow;
