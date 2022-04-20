import { BadRequestError, formatNumber, minutesSince } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveAwardService {
  private repos: IContext['repositories'];
  private chat: IContext['notifier'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
    this.chat = context.notifier;
  }

  public async create(award: INewAward): Promise<IAward> {
    const lastAwardPromise = this.repos.award.findLatest(award.userId, award.achievementId);
    const achievementPromise = this.repos.achievement.findById(award.achievementId);

    const [lastAward, achievement] = await Promise.all([lastAwardPromise, achievementPromise]);

    // Check if the user can get this achievement (cooldown)
    if (achievement.cooldownMinutes > 0 && minutesSince(lastAward.createdAt) < achievement.cooldownMinutes) {
      throw new BadRequestError('Achievement on cooldown for this user');
    }

    const awardedToPromise = this.repos.user.findById(award.userId);
    const awardedByPromise = this.repos.user.findById(award.awardedByUserId);

    const [awardedTo, awardedBy] = await Promise.all([awardedToPromise, awardedByPromise]);

    this.chat.notify(
      `*${awardedTo.name}* was awarded *${achievement.name}* (${formatNumber(achievement.achievementPoints)} pts) by ${
        awardedBy.name
      }`,
      'medium'
    );

    return await this.repos.award.create(award);
  }
}
