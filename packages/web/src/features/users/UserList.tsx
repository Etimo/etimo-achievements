import { UserDto, uuid } from '@etimo-achievements/common';
import React, { useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import PaginatedTable, {
  Column,
  PaginatedTableData,
  PaginatedTableDataEntry,
  PaginationRequestInput,
} from '../../components/table/PaginatedTable';
import { getManyUsers } from './user-utils';
import UserDeleteModal from './UserDeleteModal';
import UserEditModal from './UserEditModal';

interface UserData extends PaginatedTableData {
  name: PaginatedTableDataEntry<string>;
  email: PaginatedTableDataEntry<string>;
  slackHandle: PaginatedTableDataEntry<string>;
  edit: PaginatedTableDataEntry<React.ReactNode>;
  delete: PaginatedTableDataEntry<React.ReactNode>;
}

const UserList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<UserData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());

  const getEditId = () => query.get('edit') ?? '';
  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyUsers(input);
    if (response) {
      const { data, pagination } = response;
      setData(mapToData(data));
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

  const mapToData = (users: UserDto[]): UserData[] => {
    return users.map((u) => ({
      name: {
        value: u.name,
      },
      email: {
        value: u.email,
      },
      slackHandle: {
        value: u.slackHandle!,
      },
      edit: {
        value: <EditButton id={u.id} link={addQueryParam(window.location, 'edit', u.id)} />,
      },
      delete: {
        value: <TrashButton id={u.id} link={addQueryParam(window.location, 'delete', u.id)} loading={deleting} />,
      },
    }));
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Name',
        accessor: 'name',
        sortKey: 'name',
        className: 'w-40',
      },
      {
        title: 'E-mail',
        accessor: 'email',
        sortKey: 'email',
      },
      {
        title: 'Slack Handle',
        accessor: 'slackHandle',
        sortKey: 'slackHandle',
        className: 'w-40',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16 text-center',
        hasAccess: ['update', 'users'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'users'],
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>Users</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
      />
      {getEditId() && (
        <UserEditModal
          userId={getEditId()}
          onClose={() => removeQueryParam('edit')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
      {getDeleteId() && (
        <UserDeleteModal
          userId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </div>
  );
};

export default UserList;
