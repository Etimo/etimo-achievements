import {
  AwardDto,
  createAward,
  createFavorite,
  deleteFavorite,
  getAchievements,
  getAwards,
  getFavorites,
  listAchievements,
  listUsers,
  uniq,
} from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { AwardComposite, FavoriteComposite } from './award-types';

export const getAchievementFavorites = async (): Promise<FavoriteComposite[]> => {
  const response = await getFavorites();
  if (response.success) {
    const favorites = await response.data();
    const achievementPromise = (await getAchievements()).data();
    await Promise.allSettled([achievementPromise]);

    const achievements = await achievementPromise;

    return favorites.map((f) => achievements.find((a) => a.id === f.achievementId)!);
  } else {
    toast.error('Could not get favorite achievements: ' + (await response.errorMessage));
    return [];
  }
};

export const addAchievementFavorite = (achievementId: string) => {
  return createFavorite(achievementId).wait();
};

export const removeAchievementFavorite = (achievementId: string) => {
  return deleteFavorite(achievementId).wait();
};

export const getAllAchievementsSortedByMostUsed = async () => {
  const response = await getAchievements();
  if (response.success) {
    const achievements = await response.data();
    const awardsPromise = (await getAwards()).data();

    await Promise.allSettled([awardsPromise]);
    const awards = await awardsPromise;

    const achievementFrequency = awards.reduce((result: Record<string, number>, award: AwardDto) => {
      if (result[award.achievementId]) {
        return {
          ...result,
          [award.achievementId]: result[award.achievementId] + 1,
        };
      } else {
        // init
        return {
          ...result,
          [award.achievementId]: 1,
        };
      }
    }, {} as Record<string, number>);

    const topAchievementIds = Object.entries(achievementFrequency)
      .sort((a, b) => (a[1] < b[1] ? 1 : -1))
      .slice(0, 5)
      .map((a) => a[0]);

    const topAchievements = topAchievementIds.map((t) => achievements.find((a) => a.id === t)!);
    const otherAchievements = achievements.filter((a) => !topAchievementIds.includes(a.id));

    const totalOrder = [...topAchievements, ...otherAchievements];
    return totalOrder;
  } else {
    toast.error('Could not get awards: ' + (await response.errorMessage));
  }
};

export const giveAward = (userId: string, achievementId: string) => {
  return createAward({ userId, achievementId } as AwardDto).wait();
};

export const getManyAwards = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getAwards((page - 1) * size, size, sort, order);
  if (response.success) {
    const awards = await response.data();

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievementPromise = (await listAchievements(achievementIds)).data();

    const userIds = uniq([...awards.map((a) => a.userId), ...awards.map((a) => a.awardedByUserId)]);
    const usersPromise = (await listUsers(userIds)).data();

    await Promise.allSettled([achievementPromise, usersPromise]);
    const achievements = await achievementPromise;
    const users = await usersPromise;

    const composites = awards
      .map((award) => {
        const achievement = achievements?.find((a) => a.id === award.achievementId);
        const awardedTo = users?.find((u) => u.id === award.userId);
        const awardedBy = users?.find((u) => u.id === award.awardedByUserId);

        if (achievement && awardedTo && awardedBy) {
          return { award, achievement, awardedTo, awardedBy };
        }
      })
      .filter((c) => !!c) as AwardComposite[];

    return { pagination: response.pagination!, data: composites };
  } else {
    toast.error('Could not get awards: ' + (await response.errorMessage));
  }
};
