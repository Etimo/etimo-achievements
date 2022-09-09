import { BadRequestError, uniq } from '@etimo-achievements/common';
import { IBadgeAward, INewBadgeAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveBadgeService {
  constructor(private context: IContext) {}

  public async give(badgeAward: INewBadgeAward): Promise<IBadgeAward[]> {
    const { repositories, notifier } = this.context;

    const awardedUsersPromise = repositories.user.findByIds(uniq(badgeAward.userIds), {});
    const awardedByPromise = repositories.user.findById(badgeAward.awardedByUserId);
    const [awardedTo, awardedBy] = await Promise.all([awardedUsersPromise, awardedByPromise]);

    if (!awardedBy) throw new BadRequestError('Awarded by user does not exist');
    if (awardedTo.length === 0) throw new BadRequestError('Awarded users does not exist');

    const badge = await repositories.badge.findById(badgeAward.badgeId);
    if (!badge) throw new BadRequestError('Badge does not exist');

    const hasAwards = await Promise.all(
      awardedTo.map((u) => {
        return repositories.badgeAward.find({ where: { userId: u.id, badgeId: badgeAward.badgeId } });
      })
    );

    const alreadyHasBadgeList = hasAwards.reduce((result: string[], a: IBadgeAward[]) => {
      if (a.length !== 0) return [...result, ...a.map((x) => x.userId)];
      return result;
    }, []);

    if (alreadyHasBadgeList.length !== 0)
      throw new BadRequestError(
        `User(s): ${alreadyHasBadgeList
          .map((u) => awardedTo.find((x) => x.id === u)?.name)
          .join(', ')} already possess that badge`
      );

    const message = `${awardedTo
      .map((u) => (u.slackHandle ? `<@${u.slackHandle}>` : u.name))
      .join(', ')
      // replace last "," with "and"
      .replace(/, ([^,]*)$/, ' and $1')} earned the medal :first_place_medal: *${badge.name}*`;

    const subtitle = `${badge.name}: ${badge.description}`;

    try {
      await notifier.notify(message, { subtitle, prio: 'medium' });
    } catch (err) {}

    // TODO: transaction?
    return await Promise.all(
      awardedTo.map((x) =>
        repositories.badgeAward.create({ userId: x.id, awardedByUserId: awardedBy.id, badgeId: badge.id })
      )
    );
  }
}
