import { AchievementDto, updateAchievement } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormCheckbox, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { getSingleAchievement } from './achievement-utils';

type Props = {
  achievementId: string;
  onClose: () => void;
  onSubmit: () => void;
};

const AchievementEditModal: React.FC<Props> = ({ achievementId, onClose, onSubmit }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState<AchievementDto>();

  useEffect(() => {
    getSingleAchievement(achievementId).then(setAchievement);
  }, []);

  const onSubmitForm: SubmitHandler<AchievementDto> = async (updatedAchievement) => {
    setLoading(true);
    const response = await updateAchievement(achievementId, updatedAchievement).wait();
    setLoading(false);
    toastResponse(response, 'Achievement edited successfully', 'Achievement could not be updated', () => {
      reset();
      onSubmit();
      setTimeout(onClose, 1);
    });
  };

  return achievement ? (
    <Modal title="Edit Achievement" showModal={true} onRequestClose={onClose}>
      <Form onSubmit={handleSubmit(onSubmitForm)}>
        <FormTextInput
          label="Name"
          defaultValue={achievement.name}
          register={register('name', { required: true, maxLength: 255 })}
          error={errors.name}
        />
        <FormTextInput
          label="Description"
          defaultValue={achievement.description}
          register={register('description', { required: true, maxLength: 255 })}
          error={errors.description}
        />
        <FormTextInput
          label="Points"
          defaultValue={achievement.achievementPoints}
          register={register('achievementPoints', {
            required: true,
            valueAsNumber: true,
          })}
          error={errors.achievementPoints}
        />
        <FormTextInput
          label="Cooldown minutes"
          sublabel="Giving a user this achievement puts it on a cooldown"
          defaultValue={achievement.cooldownMinutes}
          register={register('cooldownMinutes', {
            required: true,
            valueAsNumber: true,
          })}
          error={errors.cooldownMinutes}
        />
        <FormCheckbox
          label="Global cooldown"
          sublabel="The cooldown is applied globally: no other user can receive this achievement while the cooldown is active"
          defaultValue={achievement.globalCooldowns}
          register={register('globalCooldowns')}
          error={errors.globalCooldowns}
        />
        <FormCheckbox
          label="Self awardable"
          sublabel="If unchecked: You cannot give this achievement to yourself"
          defaultValue={achievement.selfAwardable}
          register={register('selfAwardable')}
          error={errors.selfAwardable}
        />
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default AchievementEditModal;
