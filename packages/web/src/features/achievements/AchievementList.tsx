import { AchievementDto, formatNumber, uuid } from '@etimo-achievements/common';
import React, { useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { EditButton, FavoriteButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import useFavoriteAchievement from '../../hooks/use-favorite-achievement';
import { getManyAchievements } from './achievement-utils';
import AchievementDeleteModal from './AchievementDeleteModal';
import AchievementsEditModal from './AchievementEditModal';

interface AchievementData extends PaginatedTableData {
  id: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  description: PaginatedTableDataEntry<string>;
  points: PaginatedTableDataEntry<string>;
  cooldown: PaginatedTableDataEntry<string>;
  globalCooldowns: PaginatedTableDataEntry<string>;
  favorite: PaginatedTableDataEntry<React.ReactNode>;
  selfAwardable: PaginatedTableDataEntry<string>;
  edit: PaginatedTableDataEntry<React.ReactNode>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
}

const AchievementList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<AchievementDto[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const { favorites, toggleFavorite } = useFavoriteAchievement(data);

  const getEditId = () => query.get('edit') ?? '';
  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyAchievements(input);
    if (response) {
      const { data, pagination } = response;
      setData(data);
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (achievements: AchievementDto[]): AchievementData[] => {
    return achievements.map((a) => ({
      id: {
        value: a.id,
      },
      name: {
        value: a.name,
      },
      description: {
        value: a.description,
      },
      points: {
        value: `${formatNumber(a.achievementPoints)} pts`,
      },
      cooldown: {
        value: `${formatNumber(a.cooldownMinutes)} min`,
      },
      globalCooldowns: {
        value: a.globalCooldowns ? 'Yes' : 'No',
      },
      favorite: {
        value: (
          <FavoriteButton
            state={favorites.find((f) => f.id === a.id) ? 'filled' : 'outlined'}
            onClick={() => toggleFavorite(a.id)}
          />
        ),
      },
      selfAwardable: {
        value: a.selfAwardable ? 'Yes' : 'No',
      },
      edit: {
        value: <EditButton id={a.id} link={addQueryParam(window.location, 'edit', a.id)} />,
      },
      delete: {
        value: <TrashButton id={a.id} link={addQueryParam(window.location, 'delete', a.id)} loading={deleting} />,
      },
    }));
  };

  const mappedData = React.useMemo(() => mapToData(data), [favorites, data]);

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'ID',
        accessor: 'id',
        hidden: true,
      },
      {
        title: <FavoriteButton state="filled" disabled />,
        accessor: 'favorite',
      },
      {
        title: 'Name',
        accessor: 'name',
        sortKey: 'name',
        className: 'w-48',
      },
      {
        title: 'Description',
        accessor: 'description',
        sortKey: 'description',
      },
      {
        title: 'Points',
        accessor: 'points',
        sortKey: 'achievementPoints',
        className: 'w-32',
      },
      {
        title: 'Cooldown',
        accessor: 'cooldown',
        sortKey: 'cooldownMinutes',
        className: 'w-32',
      },
      {
        title: 'Global cooldown',
        accessor: 'globalCooldowns',
        tooltip:
          'Giving this achievement to a user puts it on a global cooldown: no other user can receive this achievement while the cooldown is active',
        className: 'w-32',
      },
      {
        title: 'Self awardable',
        accessor: 'selfAwardable',
        className: 'w-32',
        tooltip: 'Is it possible to give the achievement to yourself?',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16 text-center',
        hasAccess: ['update', 'achievements'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'achievements'],
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>All Achievements</Header>
      <PaginatedTable
        columns={columns}
        data={mappedData}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
      />
      {getEditId() && (
        <RequirePermission update="achievements">
          <AchievementsEditModal
            achievementId={getEditId()}
            onClose={() => removeQueryParam('edit')}
            onSubmit={() => setMonitor(uuid())}
          />
        </RequirePermission>
      )}
      {getDeleteId() && (
        <AchievementDeleteModal
          achievementId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </div>
  );
};

export default AchievementList;
