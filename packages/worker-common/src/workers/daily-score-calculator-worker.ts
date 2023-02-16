import { isDevelopment, uuid } from '@etimo-achievements/common';
import { IScore, ISeason, ISeasonScore, IUser } from '@etimo-achievements/types';
import { BaseWorker, WorkerPayload } from '../base-worker';
import { IWorkerContext } from '../context';

// This worker is called at midnight every day. It calculates the scores for the previous day.
export class DailyScoreCalculatorWorker extends BaseWorker<unknown> {
  constructor(private context: IWorkerContext) {
    super({
      name: 'daily-score-calculator',
      jobsOptions: {
        repeat: {
          pattern: isDevelopment() ? '*/5 * * * * *' : '0 */30 * * * *',
        },
      },
    });
  }

  protected override async processor(payload: WorkerPayload<unknown>): Promise<any> {
    const { repositories } = this.context;

    const seasons = await repositories.seasons.findActive();
    for (const season of seasons) {
      await this.processSeason(season);
    }
  }

  private async processSeason(season: ISeason) {
    const { repositories } = this.context;

    const users = await repositories.user.getAll();
    for (const user of users) {
      await this.calculateDailyScore(user, season);
      await this.calculateSeasonScore(user, season.id); // needs the above to be done before running
    }
  }

  private getKickback(pts: number) {
    // TODO: Get these values from season settings
    return Math.floor(Math.min(50, 0.1 * pts));
  }

  // time of date is ignored, only date is used
  private async calculateDailyScore(user: IUser, season: ISeason) {
    const { repositories, logger } = this.context;

    const date = new Date();

    logger.debug(
      `Calculating daily score for user ${user.id} on season '${season.name}' and day ${
        date.toISOString().split('T')[0]
      }`
    );

    const todaysAwards = await repositories.award.findAwardedBetween(
      new Date(date.getFullYear(), date.getMonth(), date.getDate()), // start of day
      new Date(), // now
      user.id
    );

    const achievements = await repositories.achievement.findByIds(
      todaysAwards.map((x) => x.achievementId),
      {}
    );

    // array of awards with the score of each achievement added to the award
    const awards = todaysAwards.map((a) => ({
      ...a,
      points: achievements.find((x) => x.id === a.achievementId)!.achievementPoints!,
    }));

    const score: IScore = {
      awardKickbackScore: 0,
      awardScore: 0,
      awardsGiven: 0,
      awardsReceived: 0,
      scorePerGivenAward: 0,
      scorePerReceivedAward: 0,
      totalScore: 0,
    };

    for (const award of awards) {
      // awards we have received
      if (award.userId === user.id) {
        score.awardScore += award.points;
        score.awardsReceived += 1;
        score.totalScore += award.points;
      }
      // awards we have given (no self awards)
      else {
        const kickback = this.getKickback(award.points);
        score.awardKickbackScore += kickback;
        score.awardsGiven += 1;
        score.totalScore += kickback;
      }
    }

    // Create or update daily score
    const existingDailyScore = await repositories.dailyScore.findByUserAndDay(user.id, season.id, date);
    if (!existingDailyScore) {
      await repositories.dailyScore.create({
        userId: user.id,
        seasonId: season.id,
        date: date,
        ...score,
      });
    } else {
      await repositories.dailyScore.updateById(existingDailyScore.id, {
        ...existingDailyScore,
        ...score,
      });
    }
  }

  private async calculateSeasonScore(user: IUser, seasonId: string) {
    const { repositories } = this.context;

    const dailyScores = await repositories.dailyScore.findByUserAndSeason(user.id, seasonId);

    // Calculate season scores from daily scores
    const seasonScore: ISeasonScore = {
      id: uuid(),
      userId: user.id,
      seasonId: seasonId,
      awardKickbackScore: 0,
      awardScore: 0,
      awardsGiven: 0,
      awardsReceived: 0,
      scorePerGivenAward: 0,
      scorePerReceivedAward: 0,
      totalScore: 0,
    };

    for (const dailyScore of dailyScores) {
      seasonScore.awardKickbackScore += dailyScore.awardKickbackScore;
      seasonScore.awardScore += dailyScore.awardScore;
      seasonScore.awardsGiven += dailyScore.awardsGiven;
      seasonScore.awardsReceived += dailyScore.awardsReceived;
      seasonScore.totalScore += dailyScore.totalScore;
    }

    seasonScore.scorePerGivenAward = seasonScore.awardKickbackScore / (seasonScore.awardsGiven || 1);
    seasonScore.scorePerReceivedAward = seasonScore.awardScore / (seasonScore.awardsReceived || 1);

    const existingSeasonScore = await repositories.seasonScore.getByUserAndSeason(user.id, seasonId);
    if (!existingSeasonScore) {
      await repositories.seasonScore.create(seasonScore);
    } else {
      await repositories.seasonScore.updateByUserAndSeason(user.id, seasonId, seasonScore);
    }
  }
}
