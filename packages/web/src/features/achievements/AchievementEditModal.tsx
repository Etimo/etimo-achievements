import { AchievementDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';

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
  const { achievements } = useAppSelector(achievementSelector);
  const [achievement, setAchievement] = useState<AchievementDto>();
  const achievementService = new AchievementService();

  useEffect(() => {
    setAchievement(achievements.find((a) => a.id === achievementId));
  }, [achievements]);

  const onSubmitForm: SubmitHandler<AchievementDto> = (updatedAchievement) => {
    setLoading(true);
    achievementService.update(achievementId, updatedAchievement).then((response) => {
      setLoading(false);
      toastResponse(response, 'Achievement edited successfully', 'Achievement could not be updated', () => {
        reset();
        onSubmit();
        onClose();
      });
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
          defaultValue={achievement.cooldownMinutes}
          register={register('cooldownMinutes', {
            required: true,
            valueAsNumber: true,
          })}
          error={errors.cooldownMinutes}
        />
        <FormSubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default AchievementEditModal;
