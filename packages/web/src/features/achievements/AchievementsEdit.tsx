import { AchievementDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SubmitButton, TextInput } from '../../components/form';
import Form from '../../components/form/Form';
import { AchievementApi } from './achievement-api';

const AchievementsEdit = (): JSX.Element => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const [loading, setLoading] = useState(false);
  const achievementApi = new AchievementApi();

  const onSubmit: SubmitHandler<AchievementDto> = (achievement) => {
    setLoading(true);
    achievementApi
      .update(achievement)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
          toast.success('Achievement edited successfully.');
        } else {
          toast.error('Achievement could not be updated: ' + response.message);
        }
      });
  };

  return (
    <Form title="Edit Achievement" onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Name" register={register('name', { required: true })} error={errors.name} />
      <TextInput
        label="Description"
        register={register('description', { required: true })}
        error={errors.description}
      />
      <TextInput
        label="Points"
        register={register('achievementPoints', {
          required: true,
          valueAsNumber: true,
        })}
        error={errors.achievementPoints}
      />
      <TextInput
        label="Cooldown minutes"
        register={register('cooldownMinutes', {
          required: true,
          valueAsNumber: true,
        })}
        error={errors.cooldownMinutes}
      />
      <SubmitButton label="Edit" loading={loading} />
    </Form>
  );
};

export default AchievementsEdit;
