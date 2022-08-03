import { updateProfile, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { getMyUser } from './user-utils';

type Props = {
  onClose: () => void;
  onSubmit: () => void;
};

const UserProfileEdit: React.FC<Props> = ({ onClose, onSubmit }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserDto>();

  useEffect(() => {
    getMyUser().then(setProfile);
  }, []);

  const onSubmitForm: SubmitHandler<UserDto> = async (profile) => {
    setLoading(true);
    const response = await updateProfile(profile).wait();
    toastResponse(response, 'Profile edited successfully', 'Profile could not be updated', () => {
      reset();
      onSubmit();
      onClose();
    });
    setLoading(false);
  };

  return profile ? (
    <Modal title="Edit Profile" showModal={true} onRequestClose={onClose}>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
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
        <div className="md:flex justify-center mb-5">Slack handle is automatically fetched from Slack</div>
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default UserProfileEdit;
