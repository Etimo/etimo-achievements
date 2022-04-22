import { uuid } from '@etimo-achievements/common';
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { SkeletonTableRow, Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '.';
import { queryParam } from '../../common/utils/query-helper';
import PaginationButton from './PaginationButton';

export type Column = {
  title: string;
  accessor: string;
  sortType?: (a: any, b: any) => number;
  hidden?: boolean;
};

type Props = {
  columns: Column[];
  data: any[];
  loading: boolean;
  hiddenColumns?: string[];
  pageCount: number;
  fetchData: any;
  monitor?: any;
};

const NewTable: React.FC<Props> = ({
  columns,
  data,
  loading,
  pageCount,
  hiddenColumns,
  fetchData,
  monitor,
  children,
  ...rest
}) => {
  const location = useLocation();
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [canNavigateBack, setCanNavigateBack] = useState(false);
  const [canNavigateForward, setCanNavigateForward] = useState(true);

  const getPage = () => queryParam<number>(window.location, 'page', 1);
  const getSize = () => queryParam<number>(window.location, 'size', 10);

  useEffect(() => {
    const page = getPage();
    const size = getSize();
    fetchData({ page, size });
  }, [location, monitor]);

  useEffect(() => {
    const page = getPage();
    setCanNavigateBack(page > 1);
    setCanNavigateForward(page < pageCount);
  }, [location, pageCount]);

  return (
    <div>
      <Table {...rest}>
        <TableHead>
          <TableHeaderRow>
            {columns.map(
              (column) =>
                !column.hidden && (
                  <TableHeader key={uuid()}>
                    <span>{column.title}</span>
                    <span>
                      {sortBy === column.title &&
                        (sortDirection === 'asc' ? (
                          <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-slate-100" />
                        ) : (
                          <FontAwesomeIcon icon={faChevronUp} className="ml-2 text-slate-100" />
                        ))}
                    </span>
                  </TableHeader>
                )
            )}
          </TableHeaderRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <SkeletonTableRow columns={columns.filter((c) => !c.hidden).length} rows={getSize()} />
          ) : (
            data.map((row) => {
              return (
                <TableRow key={uuid()}>
                  {columns
                    .filter((c) => !c.hidden)
                    .map((column) => {
                      return <TableCell key={uuid()}>{row[column.accessor]}</TableCell>;
                    })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <div className="m-1 float-left">
        <PaginationButton
          icon={faAnglesLeft}
          disabled={!canNavigateBack}
          link={`?page=1&size=${getSize()}`}
          title="Go to first page"
        />
        <PaginationButton
          icon={faAngleLeft}
          disabled={!canNavigateBack}
          link={`?page=${getPage() - 1}&size=${getSize()}`}
          title="Go to previous page"
        />
        <PaginationButton
          icon={faAngleRight}
          disabled={!canNavigateForward}
          link={`?page=${getPage() + 1}&size=${getSize()}`}
          title="Go to next page"
        />
        <PaginationButton
          icon={faAnglesRight}
          disabled={!canNavigateForward}
          link={`?page=${pageCount}&size=${getSize()}`}
          title="Go to last page"
        />
      </div>
      <div className="float-right m-2">
        <span className="text-slate-800">
          {getPage()} of {pageCount}
        </span>
      </div>
    </div>
  );
};

export default NewTable;
