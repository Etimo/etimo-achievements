import { formatNumber } from '@etimo-achievements/common';
import React, { useState } from 'react';
import Header from '../../components/Header';
import PaginatedTable, { Column, PaginationRequestInput } from '../../components/table/PaginatedTable';
import { HighscoreComposite } from './highscore-types';
import { getHighscores } from './highscore-utils';

const Highscores: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getHighscores(input);
    if (response) {
      const { data, pagination } = response;
      setData(mapToData(data));
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (composites: HighscoreComposite[]): any[] => {
    return composites.map((h) => ({
      name: h.user.name,
      achievements: formatNumber(h.achievements),
      points: `${formatNumber(h.points)} pts`,
      kickback: `${formatNumber(h.kickback)} pts`,
      totalPoints: `${formatNumber(h.totalPoints)} pts`,
    }));
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Achievements',
        accessor: 'achievements',
        sortKey: 'achievements',
        className: 'w-40',
      },
      {
        title: 'Achievement points',
        accessor: 'points',
        sortKey: 'points',
        className: 'w-40',
      },
      {
        title: 'Kickback points',
        accessor: 'kickback',
        sortKey: 'kickback',
        className: 'w-40',
      },
      {
        title: 'Total points',
        accessor: 'totalPoints',
        sortKey: 'totalPoints',
        className: 'w-40',
      },
    ],
    []
  );

  return (
    <div className="w-1/2 mx-auto">
      <Header>Highscores</Header>
      <PaginatedTable columns={columns} data={data} pageCount={pageCount} loading={loading} fetchData={fetchData} />
    </div>
  );
};

export default Highscores;
