import { updateUser, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import RequirePermission from '../../components/RequirePermission';
import { getSingleUser } from './user-utils';

type Props = {
  userId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const UserEditModal: React.FC<Props> = ({ userId, onClose, onSubmit }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDto>();

  useEffect(() => {
    getSingleUser(userId).then(setUser);
  }, []);

  const onSubmitForm: SubmitHandler<UserDto> = async (updatedUser) => {
    setLoading(true);
    const response = await updateUser(userId, updatedUser).wait();
    toastResponse(response, 'User edited successfully', 'User could not be updated', () => {
      reset();
      onSubmit();
      setTimeout(onClose, 1);
    });
    setLoading(false);
  };

  return user ? (
    <RequirePermission update="users">
      <Modal title="Edit User" showModal={true} onRequestClose={onClose}>
        <Form onSubmit={handleSubmit(onSubmitForm)}>
          <FormTextInput
            label="Name"
            defaultValue={user.name}
            register={register('name', { required: true, maxLength: 255 })}
            error={errors.name}
          />
          <FormTextInput
            label="E-mail"
            defaultValue={user.email}
            register={register('email', { required: true, maxLength: 255 })}
            error={errors.email}
          />
          <FormSubmitButton label="Update" loading={loading} />
        </Form>
      </Modal>
    </RequirePermission>
  ) : null;
};

export default UserEditModal;
