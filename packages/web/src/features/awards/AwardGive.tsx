import { AchievementDto, AwardDto, sort, UserDto } from '@etimo-achievements/common';
import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { toastResponse } from '../../common/utils/toast-response';
import { FavoriteButtonWithTooltip as FavoriteButton } from '../../components/buttons/FavoriteButton';
import { Form, FormSelectRow, FormSubmitButton } from '../../components/form';
import Header from '../../components/Header';
import useFavoriteAchievement from '../../hooks/use-favorite-achievement';
import { getAllUsers } from '../users/user-utils';
import { getAllAchievementsSortedByMostUsed, giveAward } from './award-utils';

const AwardGive: React.FC = () => {
  const { handleSubmit } = useForm<AwardDto>();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [users, setUsers] = useState<UserDto[]>();
  const [achievements, setAchievements] = useState<AchievementDto[]>();
  const [achievementId, setAchievementId] = useState<string>();
  const { favorites, toggleFavorite } = useFavoriteAchievement(achievements ?? []);

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

  return (
    <div className="w-1/3 mx-auto">
      <Header>Give Achievement</Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSelectRow
          label="Achievement"
          text="Select an achievement"
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
        <FormSelectRow
          label="User"
          text="Select a user"
          options={sort(users ?? [], 'name').map((a) => ({ value: a.id, label: a.name, image: a.image }))}
          value={userId}
          onChange={(value) => setUserId(value)}
          type="singleline-image"
          nothingFound="No users"
        />
        <FormSubmitButton label="Give" loading={loading} />
      </Form>
    </div>
  );
};

export default AwardGive;
