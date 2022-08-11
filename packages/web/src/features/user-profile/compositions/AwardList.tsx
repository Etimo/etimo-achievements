import { formatNumber } from '@etimo-achievements/common';
import React, { useState } from 'react';
import PaginatedTable, { Column, PaginationRequestInput } from '../../../components/table/PaginatedTable';
import { getUserAwards } from './util';

interface Props {
  userId: string;
}

const mapToData = (composites: any[]): any[] =>
  composites.map((c: any) => ({
    name: {
      value: c.achievement.name,
      tooltip: c.achievement.description,
    },
    points: {
      value: `${formatNumber(c.achievement.achievementPoints)} pts`,
    },
    createdAt: {
      value: c.award.createdAt,
    },
  }));

const columns: Column[] = [
  {
    title: 'Name',
    accessor: 'name',
  },
  {
    title: 'Points',
    accessor: 'points',
  },
  {
    title: 'Date',
    accessor: 'createdAt',
  },
];

const UserAwardList = ({ userId }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log(data);

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getUserAwards(userId, input);
    if (response) {
      const { data, pagination } = response;
      setData(mapToData(data));
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

  if (!loading && data.length === 0) return <>User has no achievements, get to work!</>;

  return <PaginatedTable columns={columns} data={data} fetchData={fetchData} loading={loading} pageCount={pageCount} />;
};

export default UserAwardList;
