import { AchievementDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form, FormSubmitButton, FormTextInput } from '../../components/form';
import Modal from '../../components/Modal';
import { AchievementApi } from './achievement-api';
import { AchievementService } from './achievement-service';

type Props = {
  achievementId: string;
  showModal: boolean;
  closeModal: () => void;
};

const AchievementsEditModal: React.FC<Props> = ({ achievementId, showModal, closeModal }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AchievementDto>();
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState<AchievementDto>();
  const achievementApi = new AchievementApi();
  const achievementService = new AchievementService();

  const refresh = () => {
    achievementService.get(achievementId).then((achievement) => {
      if (achievement) {
        setAchievement(achievement);
      }
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit: SubmitHandler<AchievementDto> = (updatedAchievement) => {
    setLoading(true);
    achievementApi
      .update(achievementId, updatedAchievement)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
          refresh();
          closeModal();
          toast.success('Achievement edited successfully.');
        } else {
          toast.error('Achievement could not be updated: ' + response.message);
        }
      });
  };

  return achievement ? (
    <Modal title="Edit Achievement" showModal={showModal} onRequestClose={closeModal}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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

export default AchievementsEditModal;
