import { BadRequestError } from '@etimo-achievements/common';
import { getEnvVariable } from '@etimo-achievements/utils';
import { WebClient } from '@slack/web-api';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { IContext } from '../..';

export class SyncSlackUsersService {
  private web: WebClient;

  constructor(private context: IContext) {
    this.web = new WebClient(getEnvVariable('SLACK_TOKEN'));
  }

  public async getUserSlackHandle(email: string) {
    const response = await this.web.users.lookupByEmail({ email });
    if (response.ok) {
      return response.user?.id;
    } else return '';
  }

  private async slackUsers() {
    return (await this.web.users.list({ team_id: getEnvVariable('SLACK_TEAM_ID') })).members as Member[];
  }

  /**
   * Updates a user's slack handle
   * @param {string} name name of user
   * @param {string} email email of user
   * @param {string} slackHandle user's slack handle
   */
  private async updateSlackHandle(name: string, email: string, slackHandle: string) {
    const { repositories, logger } = this.context;

    const foundUser = await repositories.user.findByEmail(email);
    if (!foundUser) {
      logger.error(`User ${name} not found in database. No action.`);
      throw new BadRequestError('User not found');
    }

    logger.debug(`Updating user ${name}'s Slack handle`);
    await repositories.user.update({ id: foundUser.id, slackHandle: slackHandle });
  }

  /**
   * Sync all users in database with slack.
   */
  public async syncUsers() {
    const slackUsers = await this.slackUsers();
    const etimoUsers = slackUsers.filter((user) => user.profile?.email?.endsWith('@etimo.se'));

    for (const user of etimoUsers) {
      try {
        await this.updateSlackHandle(user.profile?.real_name!, user.profile?.email!, user.id!);
      } catch (err) {} // Do not crash when a user from slack is not in db
    }
  }

  /**
   * Sync one user in database with slack.
   * @param {string} email of user to sync
   */
  public async syncUser(email: string) {
    const { logger } = this.context;
    const slackUsers = await this.slackUsers();
    const etimoUser = slackUsers.find((u) => u.profile?.email === email);
    if (!etimoUser) {
      logger.error(`User ${email} not found in database.`);
      throw new BadRequestError('User not found');
    }

    try {
      await this.updateSlackHandle(etimoUser.profile?.real_name!, etimoUser.profile?.email!, etimoUser.id!);
    } catch (err) {} // Do not crash when a user from slack is not in db
  }
}
