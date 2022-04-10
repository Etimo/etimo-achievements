import { AchievementDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { SubmitButton, TextInput } from '../../components/form';
import Form from '../../components/form/Form';
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
    <Modal title="Achievements" showModal={showModal} onRequestClose={closeModal}>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <SubmitButton label="Update" loading={loading} />
      </Form>
    </Modal>
  ) : null;
};

export default AchievementsEditModal;
