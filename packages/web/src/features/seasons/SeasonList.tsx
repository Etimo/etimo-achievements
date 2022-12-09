import { SeasonDto, uuid } from '@etimo-achievements/common';
import { Badge } from '@mantine/core';
import 'moment-timezone';
import React, { useState } from 'react';
import Moment from 'react-moment';
import { addQueryParam } from '../../common/utils/query-helper';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { getManySeasons } from './season-utils';

interface SeasonData extends PaginatedTableData {
  id: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  startsAt: PaginatedTableDataEntry<React.ReactNode>;
  endsAt: PaginatedTableDataEntry<React.ReactNode>;
  active: PaginatedTableDataEntry<React.ReactNode>;
  edit: PaginatedTableDataEntry<React.ReactNode>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
}

type FormatTimeProps = {
  time: any;
};

const FormatTime = ({ time }: FormatTimeProps) => (
  <Moment format="YYYY-MM-DD HH:mm:ss" tz="Europe/Stockholm">
    {new Date(time)}
  </Moment>
);

export const SeasonList = () => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const [data, setData] = React.useState<SeasonDto[]>([]);

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManySeasons(input);
    if (response) {
      const { data, pagination } = response;
      setData(data);
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (seasons: SeasonDto[]): SeasonData[] => {
    const timestamp = new Date().getTime();
    return seasons.map((s) => {
      const startsAt = new Date(s.startsAt).getTime();
      const endsAt = new Date(s.endsAt).getTime();

      return {
        id: {
          value: s.id,
        },
        name: {
          value: s.name,
        },
        startsAt: {
          value: <FormatTime time={startsAt} />,
        },
        endsAt: {
          value: <FormatTime time={endsAt} />,
        },
        active: {
          value:
            timestamp >= startsAt && timestamp <= endsAt ? (
              <Badge color="green">Active</Badge>
            ) : (
              <Badge color="red">Inactive</Badge>
            ),
        },
        edit: {
          value: <EditButton id={s.id} link={addQueryParam(window.location, 'edit', s.id)} />,
        },
        delete: {
          value: <TrashButton id={s.id} link={addQueryParam(window.location, 'delete', s.id)} loading={deleting} />,
        },
      };
    });
  };

  const mappedData = React.useMemo(() => mapToData(data), [data]);

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'ID',
        accessor: 'id',
        hidden: true,
      },
      {
        title: 'Name',
        accessor: 'name',
        sortKey: 'name',
        className: 'w-48',
      },
      {
        title: 'Starts at',
        accessor: 'startsAt',
      },
      {
        title: 'Ends at',
        accessor: 'endsAt',
      },
      {
        title: 'Active',
        accessor: 'active',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16 text-center',
        hasAccess: ['update', 'seasons'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'seasons'],
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>Seasons</Header>
      <PaginatedTable
        columns={columns}
        data={mappedData}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
      />
    </div>
  );
};
