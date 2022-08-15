import {
  AchievementDto,
  AwardDto,
  getAchievement,
  getAward,
  getAwards,
  getUser,
  listAchievements,
  listUsers,
  uniq,
  UserDto,
} from '@etimo-achievements/common';
import { PaginationRequestInput } from 'packages/web/src/components/table/PaginatedTable';
import toast from 'react-hot-toast';

export type AwardComposite = {
  award: AwardDto;
  awardedTo: UserDto;
  awardedBy: UserDto;
  achievement: AchievementDto;
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
