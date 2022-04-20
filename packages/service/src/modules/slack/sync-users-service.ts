import { getEnvVariable, Logger } from '@etimo-achievements/common';
import { Env } from '@etimo-achievements/types';
import { WebClient } from '@slack/web-api';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { IContext } from '../..';

export class SyncSlackUsersService {
  private repos: IContext['repositories'];
  private web: WebClient;

  constructor(context: IContext) {
    this.repos = context.repositories;
    this.web = new WebClient(getEnvVariable(Env.SLACK_TOKEN));
  }

  public async syncUsers() {
    const slackUsers = (await this.web.users.list({ team_id: process.env.SLACK_TEAM_ID })).members as Member[];
    const etimoUsers = slackUsers.filter((user) => user.profile?.email?.endsWith('@etimo.se'));

    for (const user of etimoUsers) {
      const foundUser = await this.repos.user.findByEmail(user.profile?.email!);
      if (!foundUser) {
        Logger.log(`Creating user ${user.profile?.real_name}`);
        await this.repos.user.create({
          email: user.profile?.email!,
          slackHandle: user.id!,
          name: user.profile?.real_name!,
        });
      } else {
        Logger.log(`Updating user ${user.profile?.real_name}`);
        await this.repos.user.update({ id: foundUser.id, slackHandle: user.id, name: user.profile?.real_name });
      }
    }
  }
}
