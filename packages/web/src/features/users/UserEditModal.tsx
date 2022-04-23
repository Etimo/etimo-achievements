import { UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { UserService } from './user-service';
import { usersSelector } from './user-slice';

type Props = {
  userId: string;
  closeModal: () => void;
};

const UserEditModal: React.FC<Props> = ({ userId, closeModal }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const { users } = useAppSelector(usersSelector);
  const [user, setUser] = useState<UserDto>();
  const userService = new UserService();

  useEffect(() => {
    setUser(users.find((u) => u.id === userId));
  }, [users]);

  const onSubmit: SubmitHandler<UserDto> = (updatedUser) => {
    setLoading(true);
    userService.update(userId, updatedUser).then((response) => {
      setLoading(false);
      toastResponse(response, 'User edited successfully', 'User could not be updated', () => {
        reset();
        closeModal();
      });
    });
  };

  return user ? (
    <Modal title="Edit User" showModal={true} onRequestClose={closeModal}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <FormTextInput
          label="Slack handle"
          defaultValue={user.slackHandle}
          register={register('slackHandle', { required: true, maxLength: 255 })}
          error={errors.slackHandle}
        />
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default UserEditModal;
