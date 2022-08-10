import { AchievementDto, AwardDto, sort, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSelect, FormSubmitButton } from '../../components/form';
import Header from '../../components/Header';
import { getAllUsers } from '../users/user-utils';
import { getAllAchievementsSortedByMostUsed, giveAward } from './award-utils';

const AwardGive: React.FC = () => {
  const { handleSubmit } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [users, setUsers] = useState<UserDto[]>();
  const [achievements, setAchievements] = useState<AchievementDto[]>();
  const [achievementId, setAchievementId] = useState<string>();

  useEffect(() => {
    getAllAchievementsSortedByMostUsed().then(setAchievements);
    getAllUsers().then(setUsers);
  }, []);

  const resetForm = () => {
    setUserId('');
    setAchievementId('');
  };

  const onSubmit: SubmitHandler<AwardDto> = async () => {
    setLoading(true);
    if (!userId || !achievementId) {
      setLoading(false);
      return toast.error('Please select an achievement and a user');
    }
    const response = await giveAward(userId, achievementId);
    setLoading(false);
    toastResponse(response, 'Award given successfully', 'Award could not be given', () => resetForm());
  };

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Award</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          label="Achievement"
          text="Select an achievement"
          options={(achievements ?? []).map((a) => ({
            value: a.id,
            label: a.name,
            subtitle: a.description,
          }))}
          bindValue={achievementId}
          onChange={setAchievementId}
          type="multiline"
        />
        <FormSelect
          label="User"
          text="Select a user"
          options={sort(users ?? [], 'name').map((a) => ({ value: a.id, label: a.name, image: a.image }))}
          bindValue={userId}
          onChange={setUserId}
          type="singleline-image"
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
