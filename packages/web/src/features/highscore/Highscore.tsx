import { formatNumber } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import Header from '../../components/Header';
import PaginatedTable, { Column } from '../../components/table/PaginatedTable';
import { HighscoreService } from './highscore-service';
import { HighscoreComposite } from './highscore-types';

const Highscores: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const highscoreService = new HighscoreService();

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Achievements',
        accessor: 'achievements',
        className: 'w-40',
      },
      {
        title: 'Points',
        accessor: 'points',
        className: 'w-40',
      },
    ],
    []
  );

  const mapToData = (composites: HighscoreComposite[]): any[] => {
    return composites.map((h) => ({
      name: h.user.name,
      achievements: formatNumber(h.achievements),
      points: `${formatNumber(h.points)} pts`,
    }));
  };

  return (
    <div className="w-1/2 mx-auto">
      <Header>Highscores</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        loading={loading}
        fetchData={useCallback((input: { size: any; page: any }) => {
          const { size, page } = input;
          setLoading(true);
          highscoreService.load((page - 1) * size, size).then((response) => {
            if (response) {
              const { data, pagination } = response;
              setData(mapToData(data));
              setPageCount(pagination.totalPages ?? 0);
            }
            setLoading(false);
          });
        }, [])}
      />
    </div>
  );
};

export default Highscores;
