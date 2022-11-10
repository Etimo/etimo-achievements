import { BadRequestError, formatNumber, minutesSince } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';
import { getEnvVariable } from '@etimo-achievements/utils';
import { GetHighscoreService } from '..';
import { IContext } from '../../context';

export class GiveAwardService {
  constructor(private context: IContext) {}

  public async give(award: INewAward): Promise<IAward> {
    const { repositories, notifier, logger } = this.context;

    const lastAwardPromise = repositories.award.findLatest(award.userId, award.achievementId);
    const lastAwardAnyUserPromise = repositories.award.findLatestAnyUser(award.achievementId);
    const achievementPromise = repositories.achievement.findById(award.achievementId);

    const [lastAward, lastAwardAnyUser, achievement] = await Promise.all([
      lastAwardPromise,
      lastAwardAnyUserPromise,
      achievementPromise,
    ]);

    if (!achievement) {
      throw new BadRequestError('Achievement does not exist');
    }

    // Check global cooldown
    if (
      achievement.globalCooldowns &&
      lastAwardAnyUser &&
      achievement.cooldownMinutes > 0 &&
      minutesSince(lastAwardAnyUser.createdAt) < achievement.cooldownMinutes
    ) {
      throw new BadRequestError('Achievement is on global cooldown, someone has recently received this achievement.');
    }

    // Check if the user can get this achievement (cooldown)
    if (
      lastAward &&
      achievement.cooldownMinutes > 0 &&
      minutesSince(lastAward.createdAt) < achievement.cooldownMinutes
    ) {
      throw new BadRequestError('Achievement on cooldown for this user');
    }

    const awardedToPromise = repositories.user.findById(award.userId);
    const awardedByPromise = repositories.user.findById(award.awardedByUserId);

    const [awardedTo, awardedBy] = await Promise.all([awardedToPromise, awardedByPromise]);

    if (!awardedTo || !awardedBy) {
      throw new BadRequestError('Awarded user or awarded by user does not exist');
    }

    if (!achievement.selfAwardable && awardedTo.id === awardedBy.id) {
      throw new BadRequestError('This achievement cannot be given to yourself.');
    }

    const highscoreService = new GetHighscoreService(this.context);
    const kickback = highscoreService.getKickback(achievement.achievementPoints);

    // https://api.slack.com/reference/surfaces/formatting#mentioning-users
    let slackMessage = `${
      awardedTo.slackHandle ? `<@${awardedTo.slackHandle}>` : `*${awardedTo.name}*`
    } was awarded :medal: *${achievement.name}* (${formatNumber(achievement.achievementPoints)} pts) by ${
      awardedBy.name
    }`;

    if (awardedTo.id !== awardedBy.id) {
      slackMessage += ` :foot: ${formatNumber(kickback)} pts`;
    }

    const description = achievement.name + ': ' + achievement.description;

    if (getEnvVariable('NOTIFY_SLACK', 'true') === 'true') {
      try {
        notifier.notify(slackMessage, { subtitle: description, prio: 'medium' });
      } catch (err) {}
    } else {
      logger.debug(slackMessage);
    }

    return await repositories.award.create(award);
  }
}
