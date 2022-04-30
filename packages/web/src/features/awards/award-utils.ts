import { AwardDto, createAward, getAwards, listAchievements, listUsers, uniq } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { AwardComposite } from './award-types';

export const giveAward = (userId: string, achievementId: string) => {
  return createAward({ userId, achievementId } as AwardDto).wait();
};

export const getManyAwards = async (input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getAwards((page - 1) * size, size, sort, order).wait();
  if (response.success) {
    const awards = await response.data();

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievementPromise = listAchievements(achievementIds)
      .wait()
      .then((response) => response.data());

    const userIds = uniq([...awards.map((a) => a.userId), ...awards.map((a) => a.awardedByUserId)]);
    const usersPromise = listUsers(userIds)
      .wait()
      .then((response) => response.data());

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
