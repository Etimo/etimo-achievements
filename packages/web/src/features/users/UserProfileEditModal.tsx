import { UserDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { UserService } from './user-service';
import { profileSelector } from './user-slice';

type Props = {
  closeModal: () => void;
};

const UserProfileEdit: React.FC<Props> = ({ closeModal }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const profile = useAppSelector(profileSelector);
  const userService = new UserService();

  const onSubmit: SubmitHandler<UserDto> = (profile) => {
    setLoading(true);
    userService.updateProfile(profile).then((response) => {
      setLoading(false);
      toastResponse(response, 'Profile edited successfully', 'Profile could not be updated', () => {
        reset();
        closeModal();
      });
    });
  };

  return profile ? (
    <Modal title="Edit Profile" showModal={true} onRequestClose={closeModal}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Name"
          defaultValue={profile.name}
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormTextInput
          label="E-mail"
          defaultValue={profile.email}
          register={register('email', { required: true, maxLength: 255 })}
          error={errors.email}
        />
        <FormTextInput
          label="Slack handle"
          defaultValue={profile.slackHandle}
          register={register('slackHandle', { required: true, maxLength: 255 })}
          error={errors.slackHandle}
        />
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default UserProfileEdit;
