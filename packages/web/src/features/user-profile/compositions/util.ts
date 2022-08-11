import { getAchievements, getAwards, getUsers } from '@etimo-achievements/common';
import { PaginationRequestInput } from 'packages/web/src/components/table/PaginatedTable';
import toast from 'react-hot-toast';

export const getUserAwards = async (userId: string, input: PaginationRequestInput) => {
  const { size, page, sort, order } = input;
  const response = await getAwards((page - 1) * size, size, sort, order);
  if (response.success) {
    const awards = await response.data();

    const achievementsPromise = (await getAchievements()).data();
    const usersPromise = (await getUsers()).data();

    await Promise.allSettled([achievementsPromise, usersPromise]);
    const achievements = await achievementsPromise;
    const users = await usersPromise;

    const result = awards
      .map((a) => ({
        achievement: achievements.find((ach) => ach.id === a.achievementId)!,
        award: a,
        awardedBy: users.find((u) => u.id === a.awardedByUserId)!,
        awardedTo: users.find((u) => u.id === a.userId)!,
      }))
      .filter((a) => a.awardedTo.id === userId);

    return { pagination: response.pagination!, data: result };
  } else {
    toast.error('Could not get awards: ' + (await response.errorMessage));
  }
};
