import { AchievementDto, createAchievement } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormCheckbox, FormSubmitButton, FormTextInput } from '../../components/form';
import Header from '../../components/Header';

const AchievementCreate: React.FC = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<AchievementDto> = async (achievement) => {
    setLoading(true);
    const response = await createAchievement(achievement).wait();
    setLoading(false);
    toastResponse(response, 'Achievement created successfully', 'Achievement could not be created', () => reset());
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Create Achievement</Header>
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
        <FormTextInput
          label="Points"
          register={register('achievementPoints', {
            required: true,
            valueAsNumber: true,
          })}
          error={errors.achievementPoints}
        />
        <FormTextInput
          label="Cooldown minutes"
          register={register('cooldownMinutes', {
            required: true,
            valueAsNumber: true,
          })}
          error={errors.cooldownMinutes}
        />
        <FormCheckbox
          label="Self awardable"
          defaultValue={true}
          register={register('selfAwardable')}
          error={errors.selfAwardable}
        />
        <FormSubmitButton label="Create" loading={loading} />
      </Form>
    </div>
  );
};

export default AchievementCreate;
