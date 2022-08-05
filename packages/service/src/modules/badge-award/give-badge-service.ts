import { BadRequestError } from '@etimo-achievements/common';
import { IBadgeAward, INewBadgeAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveBadgeService {
  constructor(private context: IContext) {}

  public async give(badgeAward: INewBadgeAward): Promise<IBadgeAward> {
    const { repositories, notifier } = this.context;

    const awardedToPromise = repositories.user.findById(badgeAward.userId);
    const badgeAwardedByPromise = repositories.user.findById(badgeAward.awardedByUserId);

    const [awardedTo, awardedBy] = await Promise.all([awardedToPromise, badgeAwardedByPromise]);

    if (!awardedTo || !awardedBy) {
      throw new BadRequestError('Awarded user or awarded by user does not exist');
    }

    const hasBadgePromise = repositories.badgeAward.findHasOne(badgeAward.userId, badgeAward.badgeId);
    const badgePromise = repositories.badge.findById(badgeAward.badgeId);

    const [hasBadge, badge] = await Promise.all([hasBadgePromise, badgePromise]);

    if (!badge) throw new BadRequestError('Badge does not exist');
    if (hasBadge) throw new BadRequestError('User already has this badge');

    // TODO: Notify slack

    return await repositories.badgeAward.create(badgeAward);
  }
}
