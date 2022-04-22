import { formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
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
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Achievements',
        accessor: 'achievements',
      },
      {
        title: 'Points',
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
