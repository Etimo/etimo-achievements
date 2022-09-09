import { uuid } from '@etimo-achievements/common';
import React, { useMemo, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import { NameAvatarUserCell } from '../../components/table';
import PaginatedTable, {
  Column,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { BadgeAwardComposite } from './badge-award-types';
import { getManyBadgeAwards } from './badge-award-utils';
import BadgeAwardDeleteModal from './BadgeAwardDeleteModal';

type BadgeAwardData = {
  id: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  awardedTo: PaginatedTableDataEntry<React.ReactNode>;
  date: PaginatedTableDataEntry<string>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
};

const BadgeAwardsList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [monitor, setMonitor] = useState<string>(uuid());
  const [deleting, setDeleting] = useState<string>();

  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyBadgeAwards(input);
    if (response) {
      const { data, pagination } = response;
      setData(mapToData(data));
      setPageCount(pagination?.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (composites: BadgeAwardComposite[]): BadgeAwardData[] => {
    return composites.map((c) => ({
      id: {
        value: c.badgeAward.id,
      },
      name: {
        value: c.badge.name,
        tooltip: c.badge.description,
      },
      awardedTo: {
        value: <NameAvatarUserCell user={c.awardedTo} />,
      },
      date: {
        value: new Date(c.badgeAward.createdAt ?? 0).toLocaleString('sv-SE'),
      },
      delete: {
        value: (
          <TrashButton
            id={c.badgeAward.id}
            link={addQueryParam(window.location, 'delete', c.badgeAward.id)}
            loading={deleting}
          />
        ),
      },
    }));
  };

  const columns = useMemo(
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
        title: 'Date',
        accessor: 'date',
        sortKey: 'createdAt',
        className: 'w-48',
      },
      {
        title: 'Delete',
        accessor: 'delete',
        hasAccess: ['remove', 'badge-awards'],
        className: 'w-16 text-center',
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>Given Badges</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={fetchData}
      />
      {getDeleteId() && (
        <BadgeAwardDeleteModal
          awardId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </div>
  );
};

export default BadgeAwardsList;
