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
import { Column, usePagination, useSortBy, useTable } from 'react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '.';

type Props = {
  columns: Column[];
  data: any[];
  loading: boolean;
  controlledPageIndex?: number;
  controlledPageCount?: number;
  fetchData: any;
};

const NewTable: React.FC<Props> = ({
  columns,
  data,
  loading,
  controlledPageIndex,
  controlledPageCount,
  fetchData,
  children,
  ...rest
}) => {
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
      initialState: { pageIndex: controlledPageIndex, pageSize: 10 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [pageIndex]);

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
            <TableRow>
              <TableCell>Loading...</TableCell>
            </TableRow>
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
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          title="Go to first page"
          className="w-8 h-8 text-center align-middle hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faAnglesLeft} className="text-xl text-slate-600 hover:text-slate-500" />
        </button>{' '}
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          title="Go to previous page"
          className="w-8 h-8 text-center align-middle hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faAngleLeft} className="text-xl text-slate-600 hover:text-slate-500" />
        </button>{' '}
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          title="Go to next page"
          className="w-8 h-8 text-center align-middle hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faAngleRight} className="text-xl text-slate-600 hover:text-slate-500" />
        </button>{' '}
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          title="Go to last page"
          className="w-8 h-8 text-center align-middle hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faAnglesRight} className="text-xl text-slate-600 hover:text-slate-500" />
        </button>{' '}
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
