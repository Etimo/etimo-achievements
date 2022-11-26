import { paginate, PaginatedData, sort } from '@etimo-achievements/common';
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

  public async get(seasonId: string, options: PaginationOptions): Promise<PaginatedData<IHighscore>> {
    const { repositories } = this.context;
    const { skip, take } = options;

    const seasonScores = await repositories.seasonScore.getBy({
      season_id: seasonId,
    } as any); // TODO

    const highscores: IHighscore[] = [];
    for (const score of seasonScores) {
      highscores.push({
        achievements: score.awardsReceived,
        givenAchievements: score.awardsGiven,
        kickback: score.awardKickbackScore,
        kickbackPerAchievement: score.scorePerGivenAward,
        points: score.awardScore,
        pointsPerAchievement: score.scorePerReceivedAward,
        totalPoints: score.totalScore,
        userId: score.userId,
      });
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
