import { AwardDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { Form, FormSubmitButton } from '../../components/form';
import FormSelect from '../../components/form/FormSelect';
import Header from '../../components/Header';
import { AchievementService } from '../achievements/achievement-service';
import { achievementSelector } from '../achievements/achievement-slice';
import { UserService } from '../users/user-service';
import { usersSelector } from '../users/user-slice';
import { AwardApi } from './award-api';

const AwardGive: React.FC = () => {
  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const { achievements } = useAppSelector(achievementSelector);
  const { users } = useAppSelector(usersSelector);
  const [userId, setUserId] = useState<string>();
  const [achievementId, setAchievementId] = useState<string>();
  const awardApi = new AwardApi();
  const userService = new UserService();
  const achievementService = new AchievementService();

  useEffect(() => {
    achievementService.load();
    userService.load();
  }, []);

  const onChangeAchievement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAchievementId(e.target.value);
  };

  const onChangeUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value);
  };

  const resetForm = () => {
    reset();
    setUserId(undefined);
    setAchievementId(undefined);
  };

  const onSubmit: SubmitHandler<AwardDto> = (award) => {
    setLoading(true);
    if (!userId || !achievementId) {
      setLoading(false);
      return toast.error('Please select an achievement and a user');
    }
    awardApi
      .create({ userId, achievementId } as AwardDto)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          resetForm();
          toast.success('Award created successfully.');
        } else {
          toast.error('Award could not be created: ' + response.message);
        }
      });
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Award</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          label="Achievement"
          text="Select an achievement"
          options={achievements.map((a) => ({ value: a.id, label: a.name }))}
          onChange={onChangeAchievement}
        />
        <FormSelect
          label="User"
          text="Select a user"
          options={users.map((a) => ({ value: a.id, label: a.name }))}
          onChange={onChangeUser}
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
