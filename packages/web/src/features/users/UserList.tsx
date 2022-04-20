import { sort, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import {
  SkeletonTableRow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '../../components/table';
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

  return (
    <div className="w-1/2 mx-auto">
      <Header>Users</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>E-mail</TableColumn>
          <TableColumn>Slack Handle</TableColumn>
          <TableColumn>Edit</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonTableRow columns={5} rows={3} />
          ) : (
            sort(users, 'name').map((u: UserDto) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.slackHandle}</TableCell>
                <TableCell className="text-center">
                  <EditButton id={u.id} onClick={editHandler} />
                </TableCell>
                <TableCell className="text-center">
                  <TrashButton id={u.id} onClick={trashHandler} loading={deleting} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {editUser && <UserEditModal userId={editUser.id} showModal={true} closeModal={closeModal} />}
    </div>
  );
};

export default UserList;
