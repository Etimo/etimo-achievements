import { formatNumber } from '@etimo-achievements/common';
import React, { useState } from 'react';
import Header from '../../components/Header';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { HighscoreComposite } from './highscore-types';
import { getHighscores } from './highscore-utils';

interface HighscoreData extends PaginatedTableData {
  name: PaginatedTableDataEntry<string>;
  achievements: PaginatedTableDataEntry<string>;
  points: PaginatedTableDataEntry<string>;
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

  const mapToData = (composites: HighscoreComposite[]): HighscoreData[] => {
    return composites.map((h) => ({
      name: {
        value: h.user.name,
      },
      achievements: {
        value: formatNumber(h.achievements),
      },
      points: {
        value: `${formatNumber(h.points)} pts`,
      },
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
        title: 'Points',
        accessor: 'points',
        sortKey: 'points',
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
