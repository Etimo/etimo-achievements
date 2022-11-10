import { AchievementDto, AwardDto, sort, UserDto } from '@etimo-achievements/common';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { FavoriteButtonWithTooltip as FavoriteButton } from '../../components/buttons/FavoriteButton';
import { CardRow } from '../../components/cards';
import { Form, FormSelectRow, FormSubmitButton } from '../../components/form';
import { FormMultiSelectRow } from '../../components/form/FormSelect';
import Header from '../../components/Header';
import useFavoriteAchievement from '../../hooks/use-favorite-achievement';
import { userIdSelector } from '../auth/auth-slice';
import { getAllUsers } from '../users/user-utils';
import { getAllAchievementsSortedByMostUsed, giveAward } from './award-utils';

const AwardGive: React.FC = () => {
  const { handleSubmit } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState<UserDto[]>();
  const [achievements, setAchievements] = useState<AchievementDto[]>();
  const [achievementId, setAchievementId] = useState<string>();
  const { favorites, toggleFavorite } = useFavoriteAchievement(achievements ?? []);
  const authenticatedUserId = useAppSelector(userIdSelector);

  useEffect(() => {
    getAllAchievementsSortedByMostUsed().then(setAchievements);
    getAllUsers().then(setUsers);
  }, []);

  const resetForm = () => {
    setUserIds([]);
    setAchievementId('');
  };

  const onSubmit: SubmitHandler<AwardDto> = async () => {
    setLoading(true);
    if (userIds?.length == 0 || !achievementId) {
      setLoading(false);
      return toast.error('Please select an achievement and a user');
    }
    const response = await giveAward(userIds, achievementId, authenticatedUserId!);
    setLoading(false);
    toastResponse(response, 'Award given successfully', 'Award could not be given', () => resetForm());
  };

  const isSelfAwardable = achievements?.find((a) => a.id === achievementId)?.selfAwardable == false;

  const options = useMemo(() => {
    return [
      ...(favorites ?? []).map((f) => ({
        label: f.name,
        value: f.id,
        subtitle: f.description,
        group: 'Favorites',
      })),
      ...(achievements ?? [])
        .filter((a) => !favorites.find((f) => f.id === a.id))
        .map((a) => ({
          label: a.name,
          value: a.id,
          subtitle: a.description,
          group: 'All achievements',
        })),
    ];
  }, [favorites, achievements]);

  const formatUsers = useCallback((users: UserDto[]) => {
    return sort(users ?? [], 'name').map((a) => ({ value: a.id, label: a.name, image: a.image }));
  }, []);

  const userOptions = useMemo(() => {
    const _users = users ?? [];

    if (isSelfAwardable) {
      // Remove yourself from list
      return formatUsers(_users.filter((x) => x.id !== authenticatedUserId));
    }

    return formatUsers(_users);
  }, [users, achievementId, achievements, authenticatedUserId]);

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Achievement</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelectRow
          label="Achievement"
          placeholder="Select an achievement"
          options={options}
          value={achievementId}
          onChange={(value) => setAchievementId(value)}
          type="multiline"
          nothingFound="No achievements"
        >
          <FavoriteButton
            tooltipLabel="Add as favorite"
            tooltipDisabled={!achievementId}
            state={favorites.find((f) => f.id === achievementId) ? 'filled' : 'outlined'}
            onClick={() => toggleFavorite(achievementId!)}
            disabled={!achievementId}
            className="mx-2"
          />
        </FormSelectRow>
        <FormMultiSelectRow
          label="User(s)"
          placeholder="Select user(s)"
          options={userOptions}
          value={userIds}
          onChange={setUserIds}
          type="singleline-image"
          nothingFound="No users"
        />
        {isSelfAwardable && (
          <CardRow>
            <span className="text-slate-500">This achievement cannot be awarded to yourself.</span>
          </CardRow>
        )}
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
