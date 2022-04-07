import { AchievementDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SubmitButton, TextInput } from '../../components/form';
import Form from '../../components/form/Form';
import { AchievementApi } from './achievement-api';

const AchievementsCreate = (): JSX.Element => {
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
      .create(achievement)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
          toast.success('Achievement created successfully.');
        } else {
          toast.error('Achievement could not be created: ' + response.message);
        }
      });
  };

  return (
    <Form title="Create Achievement" onSubmit={handleSubmit(onSubmit)}>
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
      <SubmitButton label="Create" loading={loading} />
    </Form>
  );
};

export default AchievementsCreate;
