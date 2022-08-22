import { paginate, PaginatedData, sort, uniq } from '@etimo-achievements/common';
import { IHighscore, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

/**
 * Percent kickback, value between 0 and 1
 */
const KICKBACK = 0.1;
const MAXIMUM_KICKBACK_POINTS = 50;

export class GetHighscoreService {
  constructor(private context: IContext) {}

  public getKickback(pts: number) {
    return Math.floor(Math.min(KICKBACK * pts, MAXIMUM_KICKBACK_POINTS));
  }

  public async get(options: PaginationOptions): Promise<PaginatedData<IHighscore>> {
    const { repositories } = this.context;
    const { skip, take } = options;

    const awards = await repositories.award.getAll();

    const userIds = uniq([...awards.map((a) => a.userId), ...awards.map((a) => a.awardedByUserId)]);
    const users = await repositories.user.findByIds(userIds, {});

    const achievementIds = uniq(awards.map((a) => a.achievementId));
    const achievements = await repositories.achievement.getManyByIds(achievementIds);

    const highscores: IHighscore[] = [];
    for (const user of users) {
      const userAwards = awards.filter((a) => a.userId === user.id);
      const givenAwards = awards.filter((a) => a.awardedByUserId === user.id);
      const userAchievements = userAwards.map((a) =>
        achievements.find((achievement) => achievement.id === a.achievementId)
      );
      // Get awards the user has given
      const awardsGiven = awards.filter(
        (a) =>
          a.awardedByUserId === user.id &&
          // Exclude self given awards
          a.userId !== user.id
      );
      const givenAchievements = awardsGiven.map((a) =>
        achievements.find((achievement) => achievement.id === a.achievementId)
      );

      if (userAchievements.length || givenAchievements.length) {
        const points = userAchievements?.reduce((a, b) => a + (b?.achievementPoints ?? 0), 0) ?? 0;
        const kickback = givenAchievements.reduce((sum, a) => sum + this.getKickback(a?.achievementPoints ?? 0), 0);

        const totalPoints = kickback + points;
        const pointsPerAchievement = totalPoints / (userAchievements.length || 1);
        const kickbackPerAchievement = kickback / (givenAwards.length || 1);

        const userHighscore: IHighscore = {
          userId: user.id,
          achievements: userAchievements.length,
          points,
          kickback,
          pointsPerAchievement,
          totalPoints,
          givenAchievements: givenAwards.length,
          kickbackPerAchievement,
        };
        highscores.push(userHighscore);
      }
    }

    let orderBy = 'totalPoints';
    let order: 'asc' | 'desc' = 'desc';
    if (options.orderBy?.length) {
      [orderBy, order] = options.orderBy[0];
    }

    const sortedHighscores = sort(highscores, orderBy, order);

    return paginate(sortedHighscores.slice(skip, skip + take), sortedHighscores.length, options);
  }
}
