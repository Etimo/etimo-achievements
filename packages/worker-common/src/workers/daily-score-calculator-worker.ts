import { IAward, IDailyScore, IScore, ISeason, IUser } from '@etimo-achievements/types';
import { BaseWorker, WorkerPayload } from '../base-worker';
import { IWorkerContext } from '../context';

export type DailyScoreCalculatorWorkerData = {
  name: string;
};

export class DailyScoreCalculatorWorker extends BaseWorker<DailyScoreCalculatorWorkerData> {
  constructor(private context: IWorkerContext) {
    super({
      name: 'daily-score-calculator',
      jobsOptions: {
        // repeat: {
        //   // At 00:00 every day
        //   //        s m H d M weekday
        //   // pattern: '0 0 0 * * *',
        // },
      },
    });
  }

  protected override async processor(payload: WorkerPayload<DailyScoreCalculatorWorkerData>): Promise<any> {
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

  private async calculateDailyScore(user: IUser, season: ISeason) {
    const { repositories } = this.context;

    const timestamp = new Date();

    const _awards = await repositories.award.findAwardedBetween(
      new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate() - 1).toISOString(), // 24 hours ago at 00.00
      new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()).toISOString(), // this day at 00.00
      user.id
    );

    const achievements = await repositories.achievement.findByIds(
      _awards.map((x) => x.achievementId),
      {}
    );

    // array of awards with the score of each achievement added to the award
    const awards = _awards.reduce((result: (IAward & { points: number })[], award: IAward) => {
      return [
        ...result,
        {
          ...award,
          points: achievements.find((x) => x.id === award.achievementId)!.achievementPoints!,
        },
      ];
    }, []);

    const score: IScore = {
      awardKickbackScore: 0,
      awardScore: 0,
      awardsGiven: 0,
      awardsReceived: 0,
      scorePerGivenAward: 0,
      scorePerReceivedAward: 0,
      totalScore: 0,
    };

    const dailyScore: IScore = awards.reduce((result: IScore, award: IAward & { points: number }) => {
      // awards we have received
      if (award.userId === user.id) {
        const awardScore = result.awardScore + award.points;
        const awardsReceived = result.awardsReceived + 1;

        return {
          ...score,
          awardScore,
          awardsReceived,
          totalScore: result.totalScore + award.points,
          scorePerReceivedAward: awardScore / (awardsReceived || 1),
        };
        // awards we have given (no self awards)
      } else {
        const kickback = Math.floor(Math.min(50, 0.1 * award.points));
        const awardKickbackScore = result.awardKickbackScore + kickback;
        const awardsGiven = result.awardsGiven + 1;

        return {
          ...score,
          awardKickbackScore,
          awardsGiven,
          totalScore: result.totalScore + kickback,
          scorePerGivenAward: awardKickbackScore / (awardsGiven || 1),
        };
      }
    }, score);

    await repositories.dailyScore.create({
      userId: user.id,
      seasonId: season.id,
      date: timestamp,
      ...dailyScore,
    });
  }

  private async calculateSeasonScore(user: IUser, seasonId: string) {
    const { repositories } = this.context;

    const seasonScore = await repositories.seasonScore.getOrCreate(user.id, seasonId);
    console.log(seasonScore);

    const dailyScores = await repositories.dailyScore.findByUserAndSeason(user.id, seasonId);
    const nextSeasonScore: IScore = dailyScores.reduce((result: IScore, dailyScore: IDailyScore) => {
      console.log(dailyScore);
      const awardKickbackScore = (result.awardKickbackScore ?? 0) + dailyScore.awardKickbackScore;
      const awardsGiven = (result.awardsGiven ?? 0) + dailyScore.awardsGiven;
      const awardScore = (result.awardScore ?? 0) + dailyScore.awardScore;
      const awardsReceived = (result.awardsReceived ?? 0) + dailyScore.awardsReceived;

      return {
        awardKickbackScore,
        awardScore,
        awardsGiven,
        awardsReceived,
        totalScore: (result.totalScore ?? 0) + dailyScore.totalScore,
        scorePerGivenAward: awardKickbackScore / (awardsGiven || 1),
        scorePerReceivedAward: awardScore / (awardsReceived || 1),
      };
    }, seasonScore);

    console.log(nextSeasonScore);

    await repositories.seasonScore.updateByUserAndSeason(user.id, seasonId, nextSeasonScore);
  }
}
