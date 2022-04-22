import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { SkeletonTableRow, Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '.';
import useQuery from '../../common/hooks/use-query';
import PaginationButton from './PaginationButton';

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
  pageCount: controlledPageCount,
  hiddenColumns,
  fetchData,
  monitor,
  children,
  ...rest
}) => {
  const requestedPageSize = useQuery().get('size');
  const requestedPageIndex = useQuery().get('page');
  const navigate = useNavigate();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: requestedPageIndex ? Math.max(parseInt(requestedPageIndex) - 1, 0) : 0,
        pageSize: requestedPageSize ? parseInt(requestedPageSize) : 10,
        hiddenColumns: hiddenColumns ?? [],
      },
      manualPagination: true,
      pageCount: controlledPageCount,
      autoResetPage: false,
      autoResetExpanded: false,
      autoResetGroupBy: false,
      autoResetSelectedRows: false,
      autoResetFilters: false,
      autoResetRowState: false,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    navigate(`?page=${pageIndex + 1}&size=${pageSize}`);
    fetchData({ pageIndex, pageSize });
  }, [pageIndex, monitor]);

  return (
    <div>
      <Table {...getTableProps()} {...rest}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableHeaderRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHeader {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <span className={column.isSorted ? 'text-slate-100' : ''}>{column.render('Header')}</span>
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-slate-100" />
                      ) : (
                        <FontAwesomeIcon icon={faChevronUp} className="ml-2 text-slate-100" />
                      )
                    ) : (
                      ''
                    )}
                  </span>
                </TableHeader>
              ))}
            </TableHeaderRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {loading ? (
            <SkeletonTableRow columns={headerGroups.reduce((a, b) => a + b.headers.length, 0)} rows={pageSize} />
          ) : (
            page.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
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
          disabled={!canPreviousPage}
          link={`?page=0&size=${pageSize}`}
          onClick={() => gotoPage(0)}
          title="Go to first page"
        />
        <PaginationButton
          icon={faAngleLeft}
          disabled={!canPreviousPage}
          link={`?page=${pageIndex - 1}&size=${pageSize}`}
          onClick={() => previousPage()}
          title="Go to previous page"
        />
        <PaginationButton
          icon={faAngleRight}
          disabled={!canNextPage}
          link={`?page=${pageIndex + 1}&size=${pageSize}`}
          onClick={() => nextPage()}
          title="Go to first page"
        />
        <PaginationButton
          icon={faAnglesRight}
          disabled={!canNextPage}
          link={`?page=${pageCount}&size=${pageSize}`}
          onClick={() => gotoPage(pageCount - 1)}
          title="Go to first page"
        />
      </div>
      <div className="float-right m-2">
        <span className="text-slate-800">
          {pageIndex + 1} of {pageOptions.length}
        </span>
      </div>
    </div>
  );
};

export default NewTable;
