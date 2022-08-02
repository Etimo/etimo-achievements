import { formatNumber } from '@etimo-achievements/common';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { NameAvatarUserCell } from '../../components/table';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { HighscoreComposite } from './highscore-types';
import { getHighscores } from './highscore-utils';

interface HighscoreData extends PaginatedTableData {
  rank: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  achievements: PaginatedTableDataEntry<string>;
  points: PaginatedTableDataEntry<string>;
  kickback: PaginatedTableDataEntry<string>;
  totalPoints: PaginatedTableDataEntry<string>;
  pointsPerAchievement: PaginatedTableDataEntry<string>;
}

const Highscores: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState<HighscoreData[]>([]);
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
    // Sorted list (desc) of unique scores
    const totalRanks = [...new Set(composites.map((c) => c.points))].sort((a, b) => (a < b ? 1 : -1));

    return composites.map((h, i) => ({
      rank: {
        value: totalRanks.indexOf(h.points) + 1, // index of the user's score in the list is the rank of the user
      },
      name: {
        value: <NameAvatarUserCell image={h.user.image} name={h.user.name} />,
      },
      achievements: {
        value: formatNumber(h.achievements),
      },
      points: {
        value: `${formatNumber(h.points)} pts`,
      },
      kickback: {
        value: `${formatNumber(h.kickback)} pts`,
      },
      totalPoints: {
        value: `${formatNumber(h.totalPoints)} pts`,
      },
      pointsPerAchievement: {
        value: `${formatNumber(h.pointsPerAchievement)} pts`,
      },
    }));
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Rank',
        accessor: 'rank',
        sortKey: 'points', // rank is based on score
      },
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
      {
        title: 'Points per achievement',
        accessor: 'pointsPerAchievement',
        sortKey: 'pointsPerAchievement',
        className: 'w-40',
      },
    ],
    []
  );

  return (
    <div className="w-2/3 mx-auto">
      <Header>Highscores</Header>
      <PaginatedTable columns={columns} data={data} pageCount={pageCount} loading={loading} fetchData={fetchData} />
    </div>
  );
};

export default Highscores;
