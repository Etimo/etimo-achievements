import { paginate, PaginatedData, sort, uniq } from '@etimo-achievements/common';
import { IHighscore, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetHighscoreService {
  constructor(private context: IContext) {}

  public async get(options: PaginationOptions): Promise<PaginatedData<IHighscore>> {
    const { repositories } = this.context;
    const { skip, take } = options;

    const awards = await repositories.award.getAll();

    const userIds = uniq(awards.map((a) => a.userId));
    const users = await repositories.user.getManyByIds(userIds);

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievements = await repositories.achievement.getManyByIds(achievementIds);

    const highscores: IHighscore[] = [];
    for (const user of users) {
      const userAwards = awards.filter((a) => a.userId === user.id);
      const userAchievements = userAwards.map((a) =>
        achievements.find((achievement) => achievement.id === a.achievementId)
      );
      if (userAchievements.length) {
        const userHighscore: IHighscore = {
          userId: user.id,
          achievements: userAchievements.length,
          points: userAchievements?.reduce((a, b) => a + (b?.achievementPoints ?? 0), 0) ?? 0,
        };
        highscores.push(userHighscore);
      }
    }

    let orderBy = 'points';
    let order: 'asc' | 'desc' = 'desc';
    if (options.orderBy?.length) {
      [orderBy, order] = options.orderBy[0];
    }

    const sortedHighscores = sort(highscores, orderBy, order);

    return paginate(sortedHighscores.slice(skip, skip + take), sortedHighscores.length, options);
  }
}
