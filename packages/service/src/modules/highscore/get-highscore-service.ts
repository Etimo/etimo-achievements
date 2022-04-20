import { paginate, PaginatedData, uniq } from '@etimo-achievements/common';
import { IHighscore } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetHighscoreService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async get(skip: number, take: number): Promise<PaginatedData<IHighscore>> {
    const awards = await this.repos.award.getMany(skip, take);

    const userIds = uniq(awards.map((a) => a.userId));
    const users = await this.repos.user.getManyByIds(userIds);

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievements = await this.repos.achievement.getManyByIds(achievementIds);

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
          points: userAchievements.reduce((a, b) => a + (b?.achievementPoints ?? 0), 0),
        };
        highscores.push(userHighscore);
      }
    }

    const sortedHighscores = highscores.sort((a, b) => b.points - a.points);

    return paginate(sortedHighscores.slice(skip, skip + take), skip, take, sortedHighscores.length);
  }
}
