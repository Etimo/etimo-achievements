import { AchievementDto, formatNumber, UserDto, uuid } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { getAllAchievements } from '../../features/achievements/achievement-utils';
import { getAllUsers } from '../../features/users/user-utils';
import useKeyValueStore from '../../hooks/use-key-value-store';
import { TrashButton } from '../buttons';
import { ClearFilters } from '../ClearFilters';
import { FormSelect } from '../form';
import { Column, NameAvatarUserCell } from '../table';
import PaginatedTable, {
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../table/PaginatedTable';
import AwardDeleteModal from './AwardDeleteModal';
import { AwardComposite, getManyAwards } from './util';

interface AwardData extends PaginatedTableData {
  id: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  awardedTo: PaginatedTableDataEntry<React.ReactNode>;
  points: PaginatedTableDataEntry<string>;
  date: PaginatedTableDataEntry<string>;
  awardedBy: PaginatedTableDataEntry<React.ReactNode>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
}

interface Props {
  filters?: Record<string, any>;
  noDataText?: string;
  filterOptions?: {
    enableAwardedToFilter?: boolean;
    enableAwardedByFilter?: boolean;
    enableAchievementFilter?: boolean;
  };
  awardedToVisible?: boolean;
}

const defaultFilterOptions: Props['filterOptions'] = {
  enableAchievementFilter: true,
  enableAwardedByFilter: true,
  enableAwardedToFilter: true,
};

const AwardList = ({ filters, noDataText, filterOptions, awardedToVisible = true }: Props): JSX.Element => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<AwardComposite[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const [achievements, setAchievements] = useState<AchievementDto[]>();
  const [users, setUsers] = useState<UserDto[]>();
  const {
    entries: selectFilters,
    removeEntry: removeFilter,
    setEntry: setFilter,
    resetEntries: resetFilters,
    noEntries: noFilters,
  } = useKeyValueStore();
  const { enableAchievementFilter, enableAwardedByFilter, enableAwardedToFilter } = {
    ...defaultFilterOptions,
    ...filterOptions,
  };

  useEffect(() => {
    getAllAchievements().then(setAchievements);
    getAllUsers().then(setUsers);
  }, []);

  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyAwards(input);
    if (response) {
      const { data, pagination } = response;
      setData(data);
      setPageCount(pagination?.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (composites: AwardComposite[]): AwardData[] => {
    return composites.map((c) => ({
      id: {
        value: c.award.id,
      },
      name: {
        value: c.achievement.name,
        tooltip: c.achievement.description,
      },
      awardedTo: {
        value: <NameAvatarUserCell user={c.awardedTo} />,
      },
      points: {
        value: `${formatNumber(c.achievement.achievementPoints)} pts`,
      },
      date: {
        value: new Date(c.award.createdAt ?? 0).toLocaleString('sv-SE'),
      },
      awardedBy: {
        value: <NameAvatarUserCell user={c.awardedBy} />,
      },
      delete: {
        value: (
          <TrashButton id={c.award.id} link={addQueryParam(window.location, 'delete', c.award.id)} loading={deleting} />
        ),
      },
    }));
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'ID',
        accessor: 'id',
        hidden: true,
      },
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Awarded To',
        accessor: 'awardedTo',
        className: 'w-40',
        hidden: !awardedToVisible,
      },
      {
        title: 'Points',
        accessor: 'points',
        className: 'w-32',
      },
      {
        title: 'Date',
        accessor: 'date',
        sortKey: 'createdAt',
        className: 'w-48',
      },
      {
        title: 'Awarded By',
        accessor: 'awardedBy',
        className: 'w-40',
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'awards'],
      },
    ],
    [awardedToVisible]
  );

  const mappedData = React.useMemo(() => mapToData(data), [data, filters]);
  const mappedAchievements = React.useMemo(
    () => (achievements ?? []).map((a) => ({ label: a.name, value: a.id, subtitle: a.description })),
    [achievements]
  );
  const mappedUsers = React.useMemo(
    () => (users ?? []).map((a) => ({ label: a.name, value: a.id, image: a.image })),
    [users]
  );

  const onSelectFilterChange = (key: string) => (value: string | undefined) => {
    if (!value) removeFilter(key);
    else {
      setFilter(key, value);
    }
  };

  return (
    <>
      <PaginatedTable
        columns={columns}
        data={mappedData}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={fetchData}
        filters={{ ...filters, ...selectFilters }}
        noDataText={noDataText}
      />
      {getDeleteId() && (
        <AwardDeleteModal
          awardId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
      Filters
      <div className="flex flex-wrap child:p-1">
        {enableAchievementFilter && (
          <FormSelect
            type="multiline"
            onChange={onSelectFilterChange('achievementId')}
            options={mappedAchievements}
            value={selectFilters.achievementId ?? null}
            placeholder="Achievement"
          />
        )}
        {enableAwardedToFilter && (
          <FormSelect
            type="singleline-image"
            onChange={onSelectFilterChange('userId')}
            options={mappedUsers}
            value={selectFilters.userId ?? null}
            placeholder="Awarded to"
          />
        )}
        {enableAwardedByFilter && (
          <FormSelect
            type="singleline-image"
            onChange={onSelectFilterChange('awardedByUserId')}
            options={mappedUsers}
            value={selectFilters.awardedByUserId ?? null}
            placeholder="Awarded by"
          />
        )}
        <ClearFilters tooltipLabel="Clear filters" onClick={resetFilters} disabled={noFilters} />
      </div>
    </>
  );
};

export default AwardList;
