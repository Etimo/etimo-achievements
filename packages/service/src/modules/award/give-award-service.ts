import { BadRequestError, formatNumber, InternalServerError, minutesSince } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';
import { getEnvVariable } from '@etimo-achievements/utils';
import { uniq } from 'lodash';
import { GetHighscoreService } from '..';
import { IContext } from '../../context';

export class GiveAwardService {
  constructor(private context: IContext) {}

  public async give(award: INewAward): Promise<IAward[]> {
    const { repositories, notifier, logger, transactionRepositories } = this.context;

    const lastAwardPromises = award.userIds.map((uid) => repositories.award.findLatest(uid, award.achievementId));
    const lastAwardAnyUserPromise = repositories.award.findLatestAnyUser(award.achievementId);
    const achievementPromise = repositories.achievement.findById(award.achievementId);

    const [lastAwards, lastAwardAnyUser, achievement] = await Promise.all([
      Promise.all(lastAwardPromises),
      lastAwardAnyUserPromise,
      achievementPromise,
    ]);

    if (!achievement) {
      throw new BadRequestError('Achievement does not exist');
    }

    const awardedToPromise = repositories.user.findByIds(uniq(award.userIds), {});
    const awardedByPromise = repositories.user.findById(award.awardedByUserId);

    const [awardedTo, awardedBy] = await Promise.all([awardedToPromise, awardedByPromise]);

    if (awardedTo.length === 0 || !awardedBy) {
      throw new BadRequestError('Awarded user or awarded by user does not exist');
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

    for (const lastAward of lastAwards) {
      if (
        lastAward &&
        achievement.cooldownMinutes > 0 &&
        minutesSince(lastAward.createdAt) < achievement.cooldownMinutes
      ) {
        throw new BadRequestError(
          `Achievement on cooldown for user: ${awardedTo.find((x) => x.id === lastAward.userId)?.name}`
        );
      }
    }

    const isSelfAward = !!awardedTo.find((u) => u.id === awardedBy.id);

    if (!achievement.selfAwardable && isSelfAward) {
      throw new BadRequestError('This achievement cannot be given to yourself.');
    }

    const highscoreService = new GetHighscoreService(this.context);
    const awardKickback = highscoreService.getKickback(achievement.achievementPoints);
    const numKickbackUsers = isSelfAward ? awardedTo.length - 1 : awardedTo.length;
    const totalKickback = numKickbackUsers * awardKickback;

    // https://api.slack.com/reference/surfaces/formatting#mentioning-users
    let slackMessage = `${awardedTo
      .map((u) => (u.slackHandle ? `<@${u.slackHandle}>` : u.name))
      .join(', ')
      // Replace last ", " with "and"
      .replace(/, ([^,]*)$/, ' and $1')} was awarded :medal: *${achievement.name}* (${formatNumber(
      achievement.achievementPoints
    )} pts) by ${awardedBy.name}`;

    if (numKickbackUsers != 0) {
      slackMessage += ` :foot: ${formatNumber(totalKickback)} pts (${numKickbackUsers}×${formatNumber(
        awardKickback
      )} pts)`;
    }

    const description = achievement.name + ': ' + achievement.description;

    if (getEnvVariable('NOTIFY_SLACK', 'true') === 'true') {
      try {
        notifier.notify(slackMessage, { subtitle: description, prio: 'medium' });
      } catch (err) {}
    } else {
      logger.debug(slackMessage);
    }

    const { commit, award: awardTransactionRepository, rollback } = await transactionRepositories();

    try {
      const result = await Promise.all(
        awardedTo.map((a) =>
          awardTransactionRepository.create({
            achievementId: award.achievementId,
            awardedByUserId: award.awardedByUserId,
            userId: a.id,
          })
        )
      );
      commit();
      return result;
    } catch (err) {
      rollback();
      throw new InternalServerError('Failed to create awards');
    }
  }
}
