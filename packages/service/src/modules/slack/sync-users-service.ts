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
    const users = etimoUsers.map((user) => ({ email: user.profile?.email, slackId: user.id }));

    for (const user of users) {
      const foundUser = await this.userRepo.findByEmail(user.email!);
      if (!foundUser) {
        Logger.log(`Creating user ${user.email}`);
        await this.userRepo.create({
          email: user.email!,
          slackHandle: user.slackId!,
          username: user.email!.split('@')[0],
          password: '',
        });
      } else {
        Logger.log(`Updating user ${user.email}`);
        await this.userRepo.update({ id: foundUser.id, slackHandle: user.slackId });
      }
    }
  }
}
