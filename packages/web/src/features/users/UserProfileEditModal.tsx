import { UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { UserApi } from './user-api';
import { UserService } from './user-service';

type Props = {
  showModal: boolean;
  closeModal: () => void;
};

const UserProfileEdit: React.FC<Props> = ({ showModal, closeModal }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDto>();
  const userApi = new UserApi();
  const userService = new UserService();

  const refresh = () => {
    userService.fetchProfile().then((user) => {
      if (user) {
        setUser(user);
      }
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit: SubmitHandler<UserDto> = (profile) => {
    setLoading(true);
    userApi
      .updateProfile(profile)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
          refresh();
          closeModal();
          toast.success('Profile edited successfully.');
        } else {
          toast.error('Profile could not be updated: ' + response.message);
        }
      });
  };

  return user ? (
    <Modal title="Edit Profile" showModal={showModal} onRequestClose={closeModal}>
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

export default UserProfileEdit;
