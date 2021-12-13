import { Logger } from '@etimo-achievements/common';
import { AchievementRepository, AwardRepository } from '@etimo-achievements/data';
import { Block, ChatPostMessageArguments, ImageBlock, KnownBlock, WebClient } from '@slack/web-api';
import { ServiceOptions } from '..';

interface ActionByCallbackId {
  [key: string]: any;
}

export class SlackInteractService {
  private achievementRepo: AchievementRepository;
  private awardRepo: AwardRepository;
  private web: WebClient;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
    this.awardRepo = options?.awardRepository ?? new AwardRepository();
    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async handleInteract(payload: any) {
    const action = this.actions[payload.view.callback_id];
    await action.function(payload);
  }

  private async awardAchievement(payload: any) {
    Logger.log(JSON.stringify(payload));
    const fromUser = payload.user;
    const metadata = JSON.parse(payload.view.private_metadata);
    const channel = metadata.channelId;
    const values = payload.view.state.values;
    const achievementId = values['achievement-input']['static_select-action'].selected_option.value;
    const toUsers = values['user-input']['multi_users_select-action'].selected_users;

    const achievement = await this.achievementRepo.findById(achievementId);

    const usersMessage = this.joinStrings(toUsers.map((user: string) => `<@${user}>`));

    const messageText = ` <@${fromUser.id}> Gave ${usersMessage} an award!`;

    const selfMention = toUsers.length == 1 && toUsers[0] == fromUser.id;

    const message: ChatPostMessageArguments = {
      channel: channel,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: messageText,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${achievement.name}*\n${achievement.description}`,
          },
          accessory: {
            type: 'image',
            image_url: selfMention
              ? 'https://i.kym-cdn.com/entries/icons/original/000/030/329/cover1.jpg'
              : 'https://ca.slack-edge.com/T044B4VDU-U01LKS59T1Q-4bd995b5e3e0-512',
            alt_text: 'medal',
          },
        },
      ],
    };

    // for (var user in toUsers) {
    //   await this.awardRepo.create({
    //     achievementId: achievementId,
    //     userId: user,
    //   });
    // }

    await this.web.chat.postMessage(message);
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
