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

  private async giveAchievement(payload: any) {
    const fromUser = payload.user;
    const metadata = JSON.parse(payload.view.private_metadata);
    const channel = metadata.channelId;
    const values = payload.view.state.values;
    const achievement = values['achievement-input']['static_select-action'].selected_option.text.text;
    const toUsers = values['user-input']['multi_users_select-action'].selected_users;
    const message = `<@${fromUser.id}> Gave <@${toUsers[0]}> the achievement: ${achievement}`;
    Logger.log(message);

    await this.web.chat.postMessage({
      channel: channel,
      text: message,
    });
  }

  private actions: ActionByCallbackId = {
    'give-achievement': {
      function: this.giveAchievement.bind(this),
    },
  };
}
