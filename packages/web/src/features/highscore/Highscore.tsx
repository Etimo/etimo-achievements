import { formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import { Column } from 'react-table';
import { useAppSelector } from '../../app/store';
import { insensitiveSort } from '../../common/utils/react-table-helpers';
import Header from '../../components/Header';
import NewTable from '../../components/table/NewTable';
import { HighscoreService } from './highscore-service';
import { highscoreSelector } from './highscore-slice';

const Highscores: React.FC = () => {
  const { highscores } = useAppSelector(highscoreSelector);
  const highscoreService = new HighscoreService();

  useEffect(() => {
    highscoreService.load();
  }, []);

  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: insensitiveSort,
      },
      {
        Header: 'Achievements',
        accessor: 'achievements',
        sortType: insensitiveSort,
      },
      {
        Header: 'Points',
        accessor: 'points',
      },
    ],
    []
  );

  return (
    <div className="w-1/2 mx-auto">
      <Header>Highscores</Header>
      <NewTable
        columns={columns}
        data={sort(highscores, 'points').map((h) => ({
          name: h.user.name,
          achievements: formatNumber(h.achievements),
          points: `${formatNumber(h.points)} pts`,
        }))}
        pageCount={0}
        loading={false}
        fetchData={() => highscoreService.load()}
      />
    </div>
  );
};

export default Highscores;
