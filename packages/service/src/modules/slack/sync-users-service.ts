import { getEnvVariable } from '@etimo-achievements/common';
import { WebClient } from '@slack/web-api';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { IContext } from '../..';

export class SyncSlackUsersService {
  private web: WebClient;

  constructor(private context: IContext) {
    this.web = new WebClient(getEnvVariable('SLACK_TOKEN'));
  }

  public async syncUsers() {
    const { repositories, logger } = this.context;

    const slackUsers = (await this.web.users.list({ team_id: getEnvVariable('SLACK_TEAM_ID') })).members as Member[];
    const etimoUsers = slackUsers.filter((user) => user.profile?.email?.endsWith('@etimo.se'));

    for (const user of etimoUsers) {
      const foundUser = await repositories.user.findByEmail(user.profile?.email!);
      if (!foundUser) {
        logger.debug(`Creating user ${user.profile?.real_name}`);
        await repositories.user.create({
          email: user.profile?.email!,
          slackHandle: user.id!,
          name: user.profile?.real_name!,
        });
      } else {
        logger.debug(`Updating user ${user.profile?.real_name}`);
        await repositories.user.update({ id: foundUser.id, slackHandle: user.id, name: user.profile?.real_name });
      }
    }
  }
}
