import { HighscoreApi, listUsers, PaginatedData, uniq } from '@etimo-achievements/common';
import { HighscoreComposite } from './highscore-types';

export class HighscoreService {
  private api = new HighscoreApi();

  public async load(
    skip: number,
    take: number,
    sort?: string,
    order?: string
  ): Promise<PaginatedData<HighscoreComposite> | undefined> {
    const response = await this.api.getMany(skip, take, sort, order).wait();
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
    }
  }
}
