import { UserDto, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { useAppSelector } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import PaginatedTable, { Column } from '../../components/table/PaginatedTable';
import { UserService } from './user-service';
import { usersSelector } from './user-slice';
import UserEditModal from './UserEditModal';

const UserList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const { users } = useAppSelector(usersSelector);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const userService = new UserService();

  const getEditId = () => query.get('edit') ?? '';
  const getDeleteId = () => query.get('delete') ?? '';

  const trashHandler = (userId: string) => {
    setDeleting(userId);
    userService.delete(userId).then((response) => {
      if (response.success) {
        setMonitor(uuid());
      }
      setDeleting(undefined);
      removeQueryParam('delete');
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

  const mapToData = (users: UserDto[]): any[] => {
    return users.map((u) => ({
      name: u.name,
      email: u.email,
      slackHandle: u.slackHandle,
      edit: <EditButton id={u.id} link={addQueryParam(window.location, 'edit', u.id)} className="w-full text-center" />,
      delete: (
        <TrashButton
          id={u.id}
          link={addQueryParam(window.location, 'delete', u.id)}
          loading={deleting}
          className="w-full text-center"
        />
      ),
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
        <RequirePermission update="users">
          <UserEditModal
            userId={getEditId()}
            onClose={() => removeQueryParam('edit')}
            onSubmit={() => setMonitor(uuid())}
          />
        </RequirePermission>
      )}
      {getDeleteId() && (
        <RequirePermission remove="users">
          <ConfirmModal
            title="Confirm delete"
            cancelLabel="No"
            confirmLabel="Yes"
            onCancel={() => {
              removeQueryParam('delete');
            }}
            onConfirm={() => {
              trashHandler(getDeleteId());
            }}
          >
            <div className="text-center">Are you sure you want to delete this user?</div>
            <div className="text-center pt-5 text-2xl">{users.find((a) => a.id === getDeleteId())?.name}</div>
          </ConfirmModal>
        </RequirePermission>
      )}
    </div>
  );
};

export default UserList;
