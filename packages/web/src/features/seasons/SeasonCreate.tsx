import { createSeason, SeasonDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { CardRow } from '../../components/cards';
import { Form, FormDateInput, FormSubmitButton, FormTextInput } from '../../components/form';
import Header from '../../components/Header';

export const SeasonCreate = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SeasonDto>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<SeasonDto> = async (season) => {
    setLoading(true);
    console.log(season);
    const response = await createSeason({
      ...season,
      startsAt: new Date(season.startsAt).toISOString() as any,
      endsAt: new Date(season.endsAt).toISOString() as any,
    }).wait();
    setLoading(false);
    toastResponse(response, 'Season created successfully', 'Season could not be created', () => reset());
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Create Season</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormTextInput
          label="Name"
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormDateInput label="Starts at" register={register('startsAt', { required: true })} error={errors.startsAt} />
        <FormDateInput label="Ends at" register={register('endsAt', { required: true })} error={errors.endsAt} />
        <CardRow>Monthly/yearly seasons are automatically created every month/year</CardRow>
        <FormSubmitButton label="Create" loading={loading} />
      </Form>
    </div>
  );
};
