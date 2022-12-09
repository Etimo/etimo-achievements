import { formatNumber } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { Column, NameAvatarUserCell } from '../../components/table';
import PaginatedTable, {
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

interface Props {
  seasonId: string;
}

export const HighscoreTable: React.VFC<Props> = ({ seasonId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = React.useState<HighscoreData[]>([]);
  const [pageCount, setPageCount] = useState(0);

  const fetchData = useCallback(
    async (input: PaginationRequestInput) => {
      setLoading(true);
      const response = await getHighscores(seasonId, input);
      if (response) {
        const { data, pagination } = response;
        setData(mapToData(data));
        setPageCount(pagination.totalPages ?? 0);
      }
      setLoading(false);
    },
    [seasonId]
  );

  const mapToData = (composites: HighscoreComposite[]): any[] => {
    return composites.map((h, i) => ({
      rank: {
        value: h.rank,
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
      kickbackPerAchievement: {
        value: `${formatNumber(parseFloat(h.kickbackPerAchievement.toFixed(2)))} pts`,
      },
    }));
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Rank',
        accessor: 'rank',
        sortKey: 'rank',
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
      {
        title: 'Kickback per given achievement',
        accessor: 'kickbackPerAchievement',
        sortKey: 'kickbackPerAchievement',
        className: 'w-40',
        tooltip: 'Total kickback / #given achievements',
      },
    ],
    []
  );

  return (
    <PaginatedTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      loading={loading}
      fetchData={fetchData}
      monitor={seasonId}
    />
  );
};
