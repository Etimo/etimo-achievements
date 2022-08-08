import { BadgeAwardDto, BadgeDto, sort, UserDto } from '@etimo-achievements/common';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSelect, FormSubmitButton } from '../../components/form';
import Header from '../../components/Header';
import { getAllBadges } from '../badges/badge-utils';
import { getAllUsers } from '../users/user-utils';
import { giveBadge } from './badge-award-utils';

const BadgeAwardGive: React.FC = () => {
  const { handleSubmit } = useForm<BadgeAwardDto>();
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<BadgeDto[]>();
  const [users, setUsers] = useState<UserDto[]>();
  const [userId, setUserId] = useState<string>();
  const [badgeId, setBadgeId] = useState<string>();

  useEffect(() => {
    getAllBadges().then(setBadges);
    getAllUsers().then(setUsers);
  }, []);

  const resetForm = () => {
    setUserId('');
    setBadgeId('');
  };

  const onSubmit: SubmitHandler<BadgeAwardDto> = useCallback(async () => {
    setLoading(true);
    if (!userId || !badgeId) {
      setLoading(false);
      return toast.error('Please select a badge and a user');
    }
    const response = await giveBadge(userId, badgeId);
    setLoading(false);
    toastResponse(response, 'Badge given successfully', 'Badge could not be given', () => resetForm());
  }, [userId, badgeId]);

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Badge</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelect
          label="Badge"
          text="Select a badge"
          options={sort(badges ?? [], 'name').map((b) => ({
            value: b.id,
            label: b.name,
            subtitle: b.description,
          }))}
          bindValue={badgeId}
          onChange={setBadgeId}
        />
        <FormSelect
          label="User"
          text="Select a user"
          options={sort(users ?? [], 'name').map((a) => ({ value: a.id, label: a.name }))}
          bindValue={userId}
          onChange={setUserId}
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default BadgeAwardGive;
