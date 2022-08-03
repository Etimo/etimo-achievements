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
   * Updates a user's slack handle, if the user is found. Otherwise does nothing.
   * @param {String} name name of user
   * @param {String} email email of user
   * @param {String} slackHandle user's slack handle
   */
  private async updateSlackHandle(name: string, email: string, slackHandle: string) {
    const { repositories, logger } = this.context;

    const foundUser = await repositories.user.findByEmail(email);
    if (!foundUser) {
      return;
    }

    logger.debug(`Updating user ${name}'s Slack handle`);
    await repositories.user.update({ id: foundUser.id, slackHandle: slackHandle });
  }

  /**
   * Sync many users in database with slack. Update their slack handle.
   */
  public async syncUsers() {
    const slackUsers = await this.slackUsers();
    const etimoUsers = slackUsers.filter((user) => user.profile?.email?.endsWith('@etimo.se'));

    for (const user of etimoUsers) {
      this.updateSlackHandle(user.profile?.real_name!, user.profile?.email!, user.id!);
    }
  }

  /**
   * Sync one user in database with slack. Update user's slack handle.
   * @param {String} email email of user to sync
   */
  public async syncUser(email: string) {
    const slackUsers = await this.slackUsers();
    const etimoUser = slackUsers.find((u) => u.profile?.email === email);
    if (!etimoUser) {
      return;
    }

    this.updateSlackHandle(etimoUser.profile?.real_name!, etimoUser.profile?.email!, etimoUser.id!);
  }
}
