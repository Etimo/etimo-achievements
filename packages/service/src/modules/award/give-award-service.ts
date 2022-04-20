import { BadRequestError, formatNumber, minutesSince } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveAwardService {
  constructor(private context: IContext) {}

  public async give(award: INewAward): Promise<IAward> {
    const { repositories, notifier } = this.context;

    const lastAwardPromise = repositories.award.findLatest(award.userId, award.achievementId);
    const achievementPromise = repositories.achievement.findById(award.achievementId);

    const [lastAward, achievement] = await Promise.all([lastAwardPromise, achievementPromise]);

    // Check if the user can get this achievement (cooldown)
    if (achievement.cooldownMinutes > 0 && minutesSince(lastAward.createdAt) < achievement.cooldownMinutes) {
      throw new BadRequestError('Achievement on cooldown for this user');
    }

    const awardedToPromise = repositories.user.findById(award.userId);
    const awardedByPromise = repositories.user.findById(award.awardedByUserId);

    const [awardedTo, awardedBy] = await Promise.all([awardedToPromise, awardedByPromise]);

    notifier.notify(
      `*${awardedTo.name}* was awarded *${achievement.name}* (${formatNumber(achievement.achievementPoints)} pts) by ${
        awardedBy.name
      }`,
      'medium'
    );

    return await repositories.award.create(award);
  }
}
