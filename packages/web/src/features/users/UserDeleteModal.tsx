import { deleteUser, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import ConfirmModal from '../../components/ConfirmModal';
import RequirePermission from '../../components/RequirePermission';
import { getSingleUser } from './user-utils';

type Props = {
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const UserDeleteModal: React.FC<Props> = ({ userId, onClose, onSubmit }) => {
  const [user, setUser] = useState<UserDto>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSingleUser(userId).then(setUser);
  }, [userId]);

  const trashHandler = async (userId: string) => {
    setLoading(true);
    const response = await deleteUser(userId).wait();
    if (response.success) {
      onSubmit();
      setTimeout(onClose, 1);
    }
    setLoading(false);
    toastResponse(response, 'User deleted successfully', 'User could not be deleted');
  };

  return (
    <RequirePermission remove="users">
      <ConfirmModal
        title="Confirm delete"
        cancelLabel="No"
        confirmLabel="Yes"
        loading={loading}
        onCancel={() => {
          onClose();
        }}
        onConfirm={() => {
          trashHandler(userId);
        }}
      >
        <div className="text-center">Are you sure you want to delete this user?</div>
        <div className="text-center pt-5 text-2xl">{user?.name}</div>
      </ConfirmModal>
    </RequirePermission>
  );
};

export default UserDeleteModal;
