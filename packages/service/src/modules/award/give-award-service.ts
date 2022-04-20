import { formatNumber } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveAwardService {
  private repos: IContext['repositories'];
  private chat: IContext['notifier'];

  constructor(context: IContext) {
    this.repos = context.repositories;
    this.chat = context.notifier;
  }

  public async create(award: INewAward): Promise<IAward> {
    const achievementPromise = this.repos.achievement.findById(award.achievementId);
    const awardedToPromise = this.repos.user.findById(award.userId);
    const awardedByPromise = this.repos.user.findById(award.awardedByUserId);

    const [achievement, awardedTo, awardedBy] = await Promise.all([
      achievementPromise,
      awardedToPromise,
      awardedByPromise,
    ]);

    this.chat.notify(
      `*${awardedTo.name}* was awarded *${achievement.name}* (${formatNumber(achievement.achievementPoints)} pts) by ${
        awardedBy.name
      }`,
      'medium'
    );

    return await this.repos.award.create(award);
  }
}
