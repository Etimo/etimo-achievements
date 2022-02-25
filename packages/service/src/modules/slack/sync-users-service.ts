import { Logger } from '@etimo-achievements/common';
import { UserRepository } from '@etimo-achievements/data';
import { WebClient } from '@slack/web-api';
import { Member } from '@slack/web-api/dist/response/UsersListResponse';
import { ServiceOptions } from '..';

export class SyncSlackUsersService {
  private userRepo: UserRepository;
  private web: WebClient;

  constructor(options?: ServiceOptions) {
    this.userRepo = options?.userRepository ?? new UserRepository();

    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async syncUsers() {
    const slackUsers = (await this.web.users.list({ team_id: process.env.SLACK_TEAM_ID })).members as Member[];
    const etimoUsers = slackUsers.filter((user) => user.profile?.email?.endsWith('@etimo.se'));

    for (const user of etimoUsers) {
      const foundUser = await this.userRepo.findByEmail(user.profile?.email!);
      if (!foundUser) {
        Logger.log(`Creating user ${user.profile?.real_name}`);
        await this.userRepo.create({
          email: user.profile?.email!,
          slackHandle: user.id!,
          name: user.profile?.real_name!,
        });
      } else {
        Logger.log(`Updating user ${user.profile?.real_name}`);
        await this.userRepo.update({ id: foundUser.id, slackHandle: user.id, name: user.profile?.real_name });
      }
    }
  }
}
