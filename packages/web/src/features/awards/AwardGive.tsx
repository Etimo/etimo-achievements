import { AwardDto, sort } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSelect, FormSubmitButton } from '../../components/form';
import Header from '../../components/Header';
import { AchievementService } from '../achievements/achievement-service';
import { achievementSelector } from '../achievements/achievement-slice';
import { UserService } from '../users/user-service';
import { usersSelector } from '../users/user-slice';
import { AwardService } from './award-service';

const AwardGive: React.FC = () => {
  const { handleSubmit } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const { achievements } = useAppSelector(achievementSelector);
  const { users } = useAppSelector(usersSelector);
  const [userId, setUserId] = useState<string>();
  const [achievementId, setAchievementId] = useState<string>();
  const awardService = new AwardService();
  const userService = new UserService();
  const achievementService = new AchievementService();

  useEffect(() => {
    achievementService.load();
    userService.load();
  }, []);

  const resetForm = () => {
    setUserId('');
    setAchievementId('');
  };

  const onSubmit: SubmitHandler<AwardDto> = () => {
    setLoading(true);
    if (!userId || !achievementId) {
      setLoading(false);
      return toast.error('Please select an achievement and a user');
    }
    awardService.create(userId, achievementId).then((response) => {
      setLoading(false);
      toastResponse(response, 'Award given successfully', 'Award could not be given', () => resetForm());
    });
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Award</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          label="Achievement"
          text="Select an achievement"
          options={sort(achievements, 'name').map((a) => ({ value: a.id, label: a.name }))}
          bindValue={achievementId}
          onChange={setAchievementId}
        />
        <FormSelect
          label="User"
          text="Select a user"
          options={sort(users, 'name').map((a) => ({ value: a.id, label: a.name }))}
          bindValue={userId}
          onChange={setUserId}
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
