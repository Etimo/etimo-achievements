import { BadgeAwardDto, BadgeDto, sort, UserDto } from '@etimo-achievements/common';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toastResponse } from '../../common/utils/toast-response';
import { Form, FormSelectRow, FormSubmitButton } from '../../components/form';
import { FormMultiSelectRow } from '../../components/form/FormSelect';
import Header from '../../components/Header';
import { getAllBadges } from '../badges/badge-utils';
import { getAllUsers } from '../users/user-utils';
import { giveBadge } from './badge-award-utils';

const BadgeAwardGive: React.FC = () => {
  const { handleSubmit } = useForm<BadgeAwardDto>();
  const [loading, setLoading] = useState(false);
  const [badges, setBadges] = useState<BadgeDto[]>();
  const [users, setUsers] = useState<UserDto[]>();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [badgeId, setBadgeId] = useState<string>();

  useEffect(() => {
    getAllBadges().then(setBadges);
    getAllUsers().then(setUsers);
  }, []);

  const resetForm = () => {
    setUserIds([]);
    setBadgeId('');
  };

  const onSubmit: SubmitHandler<BadgeAwardDto> = useCallback(async () => {
    setLoading(true);
    if (userIds.length === 0 || !badgeId) {
      setLoading(false);
      return toast.error('Please select a badge and a user');
    }
    const response = await giveBadge(userIds, badgeId);
    setLoading(false);
    toastResponse(response, 'Badge given successfully', 'Badge could not be given', () => resetForm());
  }, [userIds, badgeId]);

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Badge</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelectRow
          label="Badge"
          placeholder="Select a badge"
          options={sort(badges ?? [], 'name').map((b) => ({
            value: b.id,
            label: b.name,
            subtitle: b.description,
          }))}
          value={badgeId}
          onChange={setBadgeId}
          type="multiline"
          nothingFound="No badges"
        />
        <FormMultiSelectRow
          label="User(s)"
          placeholder="Select a user"
          nothingFound="No users"
          options={sort(users ?? [], 'name').map((a) => ({ value: a.id, label: a.name, image: a.image }))}
          value={userIds}
          onChange={setUserIds}
          type="singleline-image"
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default BadgeAwardGive;
