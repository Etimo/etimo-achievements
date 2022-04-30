import { createUser, UserDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Header from '../../components/Header';

const UserCreate: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDto>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<UserDto> = async (user) => {
    setLoading(true);
    const response = await createUser(user).wait();
    toastResponse(response, 'User created successfully', 'User could not be created', () => reset());
    setLoading(false);
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
