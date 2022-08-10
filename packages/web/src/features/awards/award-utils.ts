import {
  AwardDto,
  createAward,
  getAchievement,
  getAchievements,
  getAward,
  getAwards,
  getUser,
  listAchievements,
  listUsers,
  uniq,
} from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { AwardComposite } from './award-types';

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

export const getSingleAward = async (awardId: string): Promise<AwardComposite | undefined> => {
  const response = await getAward(awardId);
  if (response.success) {
    const award = await response.data();
    const achievementPromise = (await getAchievement(award.achievementId)).data();
    const awardedToPromise = (await getUser(award.userId)).data();
    const awardedByPromise = (await getUser(award.awardedByUserId)).data();

    await Promise.allSettled([achievementPromise, awardedToPromise, awardedByPromise]);
    const achievement = await achievementPromise;
    const awardedTo = await awardedToPromise;
    const awardedBy = await awardedByPromise;

    if (achievement && awardedTo && awardedBy) {
      return { award, achievement, awardedTo, awardedBy };
    }
  } else {
    toast.error('Could not get award: ' + (await response.errorMessage));
  }
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
