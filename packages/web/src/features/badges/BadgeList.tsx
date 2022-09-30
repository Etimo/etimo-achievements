import { BadgeDto, uuid } from '@etimo-achievements/common';
import React, { useMemo, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { getManyBadges } from './badge-utils';
import BadgeDeleteModal from './BadgeDeleteModal';
import BadgeEditModal from './BadgeEditModal';

interface BadgeData extends PaginatedTableData {
  id: PaginatedTableDataEntry<string>;
  name: PaginatedTableDataEntry<string>;
  description: PaginatedTableDataEntry<string>;
  edit: PaginatedTableDataEntry<React.ReactNode>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
}

const BadgeList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [monitor, setMonitor] = useState<string>(uuid());
  const [deleting, setDeleting] = useState<string>();

  const getEditId = () => query.get('edit') ?? '';
  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyBadges(input);
    if (response) {
      const { data, pagination } = response;
      setData(data);
      setPageCount(pagination?.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (badges: BadgeDto[]): BadgeData[] => {
    return badges.map((b) => ({
      id: {
        value: b.id,
      },
      name: {
        value: b.name,
      },
      description: {
        value: b.description,
      },
      edit: {
        value: <EditButton id={b.id} link={addQueryParam(window.location, 'edit', b.id)} />,
      },
      delete: {
        value: <TrashButton id={b.id} link={addQueryParam(window.location, 'delete', b.id)} loading={deleting} />,
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
        sortKey: 'name',
      },
      {
        title: 'Description',
        accessor: 'description',
        className: 'w-40',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16 text-center',
        hasAccess: ['update', 'badges'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'badges'],
      },
    ],
    []
  );

  const mappedData = React.useMemo(() => {
    return mapToData(data);
  }, [data]);
  console.log(mappedData);

  return (
    <div className="w-3/4 mx-auto">
      <Header>All Badges</Header>
      <PaginatedTable
        columns={columns}
        data={mappedData}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={fetchData}
        noDataText="No badges"
      />
      {getEditId() && (
        <RequirePermission update="badges">
          <BadgeEditModal
            badgeId={getEditId()}
            onClose={() => removeQueryParam('edit')}
            onSubmit={() => setMonitor(uuid())}
          />
        </RequirePermission>
      )}
      {getDeleteId() && (
        <BadgeDeleteModal
          badgeId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </div>
  );
};

export default BadgeList;
