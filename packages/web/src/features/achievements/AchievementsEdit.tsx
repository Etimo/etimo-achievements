import { AchievementDto } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SubmitButton, TextInput } from '../../components/form';
import Form from '../../components/form/Form';
import { AchievementApi } from './achievement-api';

type Props = {
  achievement: AchievementDto;
};

const AchievementsEdit: React.FC<Props> = ({ achievement }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const [loading, setLoading] = useState(false);
  const achievementApi = new AchievementApi();

  const onSubmit: SubmitHandler<AchievementDto> = (updatedAchievement) => {
    setLoading(true);
    achievementApi
      .update(achievement.id, updatedAchievement)
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
      <TextInput
        label="Name"
        defaultValue={achievement.name}
        register={register('name', { required: true })}
        error={errors.name}
      />
      <TextInput
        label="Description"
        defaultValue={achievement.description}
        register={register('description', { required: true })}
        error={errors.description}
      />
      <TextInput
        label="Points"
        defaultValue={achievement.achievementPoints}
        register={register('achievementPoints', {
          required: true,
          valueAsNumber: true,
        })}
        error={errors.achievementPoints}
      />
      <TextInput
        label="Cooldown minutes"
        defaultValue={achievement.cooldownMinutes}
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
