import { BadgeDto, createBadge } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Header from '../../components/Header';

const BadgeCreate: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<BadgeDto>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<BadgeDto> = async (badge) => {
    setLoading(true);
    const response = await createBadge(badge).wait();
    setLoading(false);
    toastResponse(response, 'Badge created successfully', 'Badge could not be created', () => reset());
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Create Badge</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Name"
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormTextInput
          label="Description"
          register={register('description', { required: true, maxLength: 255 })}
          error={errors.description}
        />
        <FormSubmitButton label="Create" loading={loading} />
      </Form>
    </div>
  );
};

export default BadgeCreate;
