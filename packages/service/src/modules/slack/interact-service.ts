import { Logger } from '@etimo-achievements/common';
import { AchievementRepository } from '@etimo-achievements/data';
import { WebClient } from '@slack/web-api';
import { ServiceOptions } from '..';

interface ActionByCallbackId {
  [key: string]: any;
}

export class SlackInteractService {
  private achievementRepo: AchievementRepository;
  private web: WebClient;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();

    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async handleInteract(payload: any) {
    const action = this.actions[payload.view.callback_id];
    await action.function(payload);
  }

  private async awardAchievement(payload: any) {
    const fromUser = payload.user;
    const metadata = JSON.parse(payload.view.private_metadata);
    const channel = metadata.channelId;
    const values = payload.view.state.values;
    const achievement = values['achievement-input']['static_select-action'].selected_option.text.text;
    const toUsers = values['user-input']['multi_users_select-action'].selected_users;

    const usersMessage = this.joinStrings(toUsers.map((user: string) => `<@${user}>`));

    const message = `<@${fromUser.id}> Gave ${usersMessage} the achievement: ${achievement}`;
    Logger.log(message);

    await this.web.chat.postMessage({
      channel: channel,
      text: message,
    });
  }

  private actions: ActionByCallbackId = {
    'award-achievement': {
      function: this.awardAchievement.bind(this),
    },
  };

  //Function to join strings with commas + 'and'
  private joinStrings(strings: string[]) {
    if (strings.length === 1) {
      return strings[0];
    }
    if (strings.length === 2) {
      return `${strings[0]} and ${strings[1]}`;
    }
    return `${strings.slice(0, -1).join(', ')} and ${strings[strings.length - 1]}`;
  }
}
