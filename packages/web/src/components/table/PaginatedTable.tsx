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
import { Tooltip } from '@mantine/core';
import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '.';
import useHasAccess, { Action, Resource } from '../../common/hooks/use-has-access';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { queryParam, replaceQueryParam } from '../../common/utils/query-helper';
import PaginationButton from './PaginationButton';

export type Column = {
  title: string;
  accessor: string;
  sortKey?: string;
  className?: string;
  hidden?: boolean;
  hasAccess?: [Action, Resource];
  tooltip?: string | React.ReactNode;
};

export type PaginationRequestInput = {
  size: number;
  page: number;
  sort?: string;
  order?: string;
  filters?: Record<string, any>;
};

export type PaginatedTableDataEntry<T> = {
  value: T;
  /** Text to render when hover on cell */
  tooltip?: string;
};

export type PaginatedTableData = {
  [key: string]: PaginatedTableDataEntry<any>;
};

type Props = {
  columns: Column[];
  data: PaginatedTableData[];
  loading: boolean;
  pageCount: number;
  fetchData: any;
  monitor?: any;
  filters?: Record<string, any>;
  noDataText?: string;
};

const PaginatedTable: React.FC<Props> = ({
  columns,
  data,
  loading,
  pageCount,
  fetchData,
  monitor,
  children,
  filters,
  noDataText,
  ...rest
}) => {
  const navigate = useNavigate();
  const query = useQuery();
  const hasAccess = useHasAccess();
  const location = useLocation();
  const removeQueryParam = useRemoveQueryParam();
  const [pagination, setPagination] = useState<[number, number, string, string?, string?, Record<string, any>?]>([
    1,
    10,
    '',
  ]);
  const [canNavigateBack, setCanNavigateBack] = useState(false);
  const [canNavigateForward, setCanNavigateForward] = useState(true);

  const getPage = () => Math.max(queryParam<number>(window.location, 'page', 1), 1);
  const getSize = () => Math.min(Math.max(queryParam<number>(window.location, 'size', 10), 1), 50);
  const getSort = () => query.get('sort') ?? '';
  const getOrder = () => query.get('order') ?? 'asc';
  const setSort = (key: string) => navigate(replaceQueryParam(window.location, 'sort', key));
  const setOrder = (order: string) => navigate(replaceQueryParam(window.location, 'order', order));

  useEffect(() => {
    const [oldPage, oldSize, oldSort, oldOrder, oldMonitor, oldFilters] = pagination;
    const page = getPage();
    const size = getSize();
    const sort = getSort();
    const order = getOrder();
    if (
      page !== oldPage ||
      size !== oldSize ||
      sort !== oldSort ||
      order !== oldOrder ||
      monitor !== oldMonitor ||
      !isEqual(filters, oldFilters)
    ) {
      (async () => {
        setPagination([page, size, sort, order, monitor, filters]);
        await fetchData({ page, size, sort, order, filters });
      })();
    }
  }, [location, monitor, filters]);

  useEffect(() => {
    const page = getPage();
    setCanNavigateBack(page > 1);
    setCanNavigateForward(page < pageCount);
  }, [location, pageCount]);

  const userHasAccess = (column: Column) => {
    if (!column.hasAccess) return true;

    const [action, resource] = column.hasAccess;
    return hasAccess(action, resource);
  };

  return (
    <div className="w-full">
      <Table {...rest}>
        <TableHead>
          <TableHeaderRow>
            {columns.map(
              (column) =>
                !column.hidden &&
                userHasAccess(column) && (
                  <TableHeader
                    onClick={() => {
                      if (column.sortKey) {
                        if (column.sortKey === getSort()) {
                          if (getOrder() === 'desc') {
                            removeQueryParam('sort');
                            removeQueryParam('order');
                          } else {
                            setOrder('desc');
                          }
                        } else {
                          setSort(column.sortKey);
                          setOrder('asc');
                        }
                      }
                    }}
                    key={uuid()}
                  >
                    <Tooltip label={column.tooltip} disabled={!column.tooltip}>
                      <span>
                        <span>{column.title}</span>
                        <span>
                          {getSort() === column.sortKey &&
                            (getOrder() === 'asc' ? (
                              <FontAwesomeIcon icon={faChevronUp} className="ml-2 text-slate-100" />
                            ) : (
                              <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-slate-100" />
                            ))}
                        </span>
                      </span>
                    </Tooltip>
                  </TableHeader>
                )
            )}
          </TableHeaderRow>
        </TableHead>
        <TableBody>
          {loading
            ? Array(getSize())
                .fill(undefined)
                .map((row) => {
                  return (
                    <TableRow key={uuid()}>
                      {columns
                        .filter((c) => !c.hidden && userHasAccess(c))
                        .map((column) => {
                          return (
                            <TableCell key={uuid()} className={column.className}>
                              &nbsp;
                            </TableCell>
                          );
                        })}
                    </TableRow>
                  );
                })
            : data.map((row) => {
                return (
                  <TableRow key={uuid()}>
                    {columns
                      .filter((c) => !c.hidden && userHasAccess(c))
                      .map((column) => {
                        return (
                          <TableCell key={uuid()} className={column.className} tooltip={row[column.accessor].tooltip}>
                            {row[column.accessor].value}
                          </TableCell>
                        );
                      })}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      {!loading && data.length === 0 && (
        <div className="w-full text-center p-3 bg-slate-300">{noDataText ?? 'No data'}</div>
      )}
      <div className="m-2 float-left">
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

export default PaginatedTable;
