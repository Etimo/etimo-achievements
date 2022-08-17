import { formatNumber, uuid } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { TrashButton } from '../buttons';
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
  filter?: (award: AwardComposite) => boolean;
  noDataText?: string;
}

const AwardList = ({ filter = () => true, noDataText }: Props): JSX.Element => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<AwardComposite[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());

  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyAwards(input);
    if (response) {
      const { data, pagination } = response;
      setData(data);
      setPageCount(pagination.totalPages ?? 0);
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
    []
  );

  // Initial fetch
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        fetchData({ page: 1, size: 50 });
      })();
    }
  }, []);

  const mappedData = React.useMemo(() => mapToData(data.filter(filter)), [data, filter]);

  if (!loading && data.length === 0) return <>{noDataText ? noDataText : 'No awards'}</>;

  return (
    <>
      <PaginatedTable
        columns={columns}
        data={mappedData}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={fetchData}
      />
      {getDeleteId() && (
        <AwardDeleteModal
          awardId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </>
  );
};

export default AwardList;
