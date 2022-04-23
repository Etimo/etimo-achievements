import { UserDto, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { addQueryParam, queryParam, removeQueryParam } from '../../common/utils/query-helper';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import PaginatedTable, { Column } from '../../components/table/PaginatedTable';
import { UserService } from './user-service';
import UserEditModal from './UserEditModal';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const userService = new UserService();

  const getEditId = () => queryParam<string>(window.location, 'edit', '');

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    userService.delete(e.currentTarget.id).then((response) => {
      if (response.success) {
        setMonitor(uuid());
      }
      setDeleting(undefined);
      toastResponse(response, 'User deleted successfully', 'User could not be deleted');
    });
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Name',
        accessor: 'name',
        className: 'w-40',
      },
      {
        title: 'E-mail',
        accessor: 'email',
      },
      {
        title: 'Slack Handle',
        accessor: 'slackHandle',
        className: 'w-32',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16',
        hasAccess: ['update', 'users'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16',
        hasAccess: ['remove', 'users'],
      },
    ],
    []
  );

  const mapToData = (users: UserDto[]): any[] => {
    return users.map((u) => ({
      name: u.name,
      email: u.email,
      slackHandle: u.slackHandle,
      edit: <EditButton id={u.id} link={addQueryParam(window.location, 'edit', u.id)} className="w-full text-center" />,
      delete: <TrashButton id={u.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
    }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Users</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        fetchData={useCallback(
          (input: { size: any; page: any }) => {
            const { size, page } = input;
            setLoading(true);
            userService.getMany((page - 1) * size, size).then((response) => {
              if (response) {
                const { data, pagination } = response;
                setData(mapToData(data));
                setPageCount(pagination.totalPages ?? 0);
              }
              setLoading(false);
            });
          },
          [monitor]
        )}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
      />
      {getEditId() && (
        <UserEditModal
          userId={getEditId()}
          closeModal={() => {
            navigate(removeQueryParam(window.location, 'edit'));
            setMonitor(uuid());
          }}
        />
      )}
    </div>
  );
};

export default UserList;
