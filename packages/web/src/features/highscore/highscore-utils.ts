import { getManyHighscores, listUsers, PaginatedData, uniq } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { HighscoreComposite } from './highscore-types';

export const getHighscores = async (
  input: PaginationRequestInput
): Promise<PaginatedData<HighscoreComposite> | undefined> => {
  const { size, page, sort, order } = input;
  const response = await getManyHighscores((page - 1) * size, size, sort, order);
  if (response.success) {
    const highscores = await response.data();

    const userIds = uniq(highscores.map((a) => a.userId));
    const users = await (await listUsers(userIds)).data();

    const composites: HighscoreComposite[] = [];
    for (const highscore of highscores) {
      const user = users?.find((u) => u.id === highscore.userId);
      if (user) {
        composites.push({
          user,
          achievements: highscore.achievements,
          points: highscore.points,
          kickback: highscore.kickback,
          totalPoints: highscore.totalPoints,
          pointsPerAchievement: highscore.pointsPerAchievement,
          givenAchievements: highscore.givenAchievements,
          kickbackPerAchievement: highscore.kickbackPerAchievement,
        });
      }
    }

    return { pagination: response.pagination!, data: composites };
  } else {
    toast.error('Could not get highscores: ' + (await response.errorMessage));
  }
};
