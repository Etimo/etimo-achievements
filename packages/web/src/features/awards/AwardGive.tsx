import { AwardDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { Form, FormSubmitButton } from '../../components/form';
import FormDropdown from '../../components/form/FormDropdown';
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
  const awardApi = new AwardApi();
  const userService = new UserService();
  const achievementService = new AchievementService();

  useEffect(() => {
    achievementService.load();
    userService.load();
  }, []);

  const onSubmit: SubmitHandler<AwardDto> = (award) => {
    setLoading(true);
    awardApi
      .create(award)
      .wait()
      .then((response) => {
        setLoading(false);
        if (response.success) {
          reset();
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
        <FormDropdown label="Achievement" selectText="Select an achievement">
          {achievements.map((a) => (
            <option value={a.id} key={a.id}>
              {a.name}
            </option>
          ))}
        </FormDropdown>
        <FormDropdown label="User" selectText="Select a user">
          {users.map((a) => (
            <option value={a.id} key={a.id}>
              {a.name}
            </option>
          ))}
        </FormDropdown>
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
