import { HighscoreApi, listUsers, PaginatedData, uniq } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { PaginationRequestInput } from '../../components/table/PaginatedTable';
import { HighscoreComposite } from './highscore-types';

const api = new HighscoreApi();

export const getHighscores = async (
  input: PaginationRequestInput
): Promise<PaginatedData<HighscoreComposite> | undefined> => {
  const { size, page, sort, order } = input;
  const response = await api.getMany((page - 1) * size, size, sort, order).wait();
  if (response.success) {
    const highscores = await response.data();

    const userIds = uniq(highscores.map((a) => a.userId));
    const users = await (await listUsers(userIds).wait()).data();

    const composites: HighscoreComposite[] = [];
    for (const highscore of highscores) {
      const user = users?.find((u) => u.id === highscore.userId);
      if (user) {
        composites.push({
          user,
          achievements: highscore.achievements,
          points: highscore.points,
        });
      }
    }

    return { pagination: response.pagination!, data: composites };
  } else {
    toast.error('Could not get highscores: ' + (await response.errorMessage));
  }
};
