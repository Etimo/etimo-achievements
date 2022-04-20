import { UserDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Header from '../../components/Header';
import { UserApi } from './user-api';

const UserCreate: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);
  const userApi = new UserApi();

  const onSubmit: SubmitHandler<UserDto> = (user) => {
    setLoading(true);
    userApi
      .create(user)
      .wait()
      .then((response) => {
        setLoading(false);
        toastResponse(response, 'User created successfully', 'User could not be created', () => reset());
      });
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Create User</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Name"
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormTextInput
          label="E-mail"
          register={register('email', { required: true, maxLength: 255 })}
          error={errors.email}
        />
        <FormTextInput
          label="Slack Handle"
          register={register('slackHandle', {
            required: true,
            maxLength: 255,
          })}
          error={errors.slackHandle}
        />
        <FormSubmitButton label="Create" loading={loading} />
      </Form>
    </div>
  );
};

export default UserCreate;
