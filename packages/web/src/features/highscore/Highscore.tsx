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
  givenAchievements: PaginatedTableDataEntry<string>;
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
        value: <NameAvatarUserCell user={h.user} />,
      },
      achievements: {
        value: formatNumber(h.achievements),
      },
      givenAchievements: {
        value: formatNumber(h.givenAchievements),
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
        // Two decimals
        value: `${formatNumber(parseFloat(h.pointsPerAchievement.toFixed(2)))} pts`,
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
        tooltip: 'How many achievements this user has been awarded',
      },
      {
        title: 'Given achievements',
        accessor: 'givenAchievements',
        sortKey: 'givenAchievements',
        className: 'w-40',
        tooltip: 'How many achievements a user has given other users',
      },
      {
        title: 'Achievement points',
        accessor: 'points',
        sortKey: 'points',
        className: 'w-40',
        tooltip: 'Points awarded from achievements',
      },
      {
        title: 'Kickback points',
        accessor: 'kickback',
        sortKey: 'kickback',
        className: 'w-40',
        tooltip: (
          <span>
            <div>Points received for giving achievements.</div>
            <div>10% of achievement score, capped at 50 points</div>
          </span>
        ),
      },
      {
        title: 'Total points',
        accessor: 'totalPoints',
        sortKey: 'totalPoints',
        className: 'w-40',
        tooltip: 'Achievement points + kickback points',
      },
      {
        title: 'Points per achievement',
        accessor: 'pointsPerAchievement',
        sortKey: 'pointsPerAchievement',
        className: 'w-40',
        tooltip: 'Total points / #achievements',
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
