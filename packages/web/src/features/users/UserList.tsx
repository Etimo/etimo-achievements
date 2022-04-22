import { sort, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { UserService } from './user-service';
import { usersSelector } from './user-slice';
import UserEditModal from './UserEditModal';

const UserList: React.FC = () => {
  const { users } = useAppSelector(usersSelector);
  const userService = new UserService();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string>();
  const [editUser, setEditUser] = useState<UserDto>();

  useEffect(() => {
    userService.load().then(() => setLoading(false));
  }, []);

  const closeModal = () => {
    setEditUser(undefined);
  };

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    userService.delete(e.currentTarget.id).then((response) => {
      setDeleting(undefined);
      toastResponse(response, 'User deleted successfully', 'User could not be deleted');
    });
  };

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const user = users.find((a) => a.id === e.currentTarget.id);
    if (user) {
      setEditUser(user);
    }
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'E-mail',
        accessor: 'email',
      },
      {
        title: 'Slack Handle',
        accessor: 'slackHandle',
      },
      {
        title: 'Edit',
        accessor: 'edit',
      },
      {
        title: 'Delete',
        accessor: 'delete',
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>Users</Header>
      <NewTable
        columns={columns}
        data={sort(users, 'name').map((u) => ({
          name: u.name,
          email: u.email,
          slackHandle: u.slackHandle,
          edit: <EditButton id={u.id} link="broken" className="w-full text-center" />,
          delete: <TrashButton id={u.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
        }))}
        pageCount={0}
        loading={false}
        fetchData={() => userService.load()}
      />
      {editUser && <UserEditModal userId={editUser.id} showModal={true} closeModal={closeModal} />}
    </div>
  );
};

export default UserList;
