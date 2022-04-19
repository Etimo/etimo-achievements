import { AchievementRepository, UserRepository } from '@etimo-achievements/data';
import { IAchievement, INewAward } from '@etimo-achievements/types';
import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import { CreateAwardService, ServiceOptions } from '..';

type AwardSlackAchivementInteractServiceOptions = {
  createAwardService?: CreateAwardService;
} & ServiceOptions;

export class AwardSlackAchievementsInteractService {
  private achievementRepo: AchievementRepository;
  private createAwardService: CreateAwardService;
  private userRepo: UserRepository;
  private web: WebClient;

  constructor(options: AwardSlackAchivementInteractServiceOptions) {
    this.achievementRepo = options.achievementRepository ?? new AchievementRepository();
    this.userRepo = options.userRepository ?? new UserRepository();
    this.createAwardService = options.createAwardService ?? new CreateAwardService(options);

    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async handleInteract(payload: any) {
    const fromUserSlackHandle = payload.user.id;
    const metadata = JSON.parse(payload.view.private_metadata);
    const channel = metadata.channelId;
    const values = payload.view.state.values;
    const achievementId = values['achievement-input']['static_select-action'].selected_option.value;
    const toUserSlackHandles = values['user-input']['multi_users_select-action'].selected_users;

    const achievement = await this.achievementRepo.findById(achievementId);
    const fromUser = await this.userRepo.findBySlackHandle(fromUserSlackHandle);
    const toUsers = await this.userRepo.findBySlackHandles(toUserSlackHandles);

    // TODO: Improve error handling.
    if (achievement == null) {
      throw new Error('Achievement not found');
    } else if (fromUser == null) {
      throw new Error('From user not found');
    } else if (toUsers.length == 0) {
      throw new Error('To user not found');
    }

    const awards = toUsers.map(
      (toUser) =>
        <INewAward>{
          achievementId: achievement.id,
          awardedByUserId: fromUser.id,
          userId: toUser.id,
        }
    );

    await this.createAwardService.createMultiple(awards);

    await this.postAwardMessage(channel, fromUserSlackHandle, toUserSlackHandles, achievement);
  }

  private async postAwardMessage(
    channel: string,
    fromUserSlackHandle: string,
    toUserSlackHandles: string[],
    achievement: IAchievement
  ) {
    const usersMessage = this.joinStrings(toUserSlackHandles.map((user: string) => `<@${user}>`));

    const messageText = ` <@${fromUserSlackHandle}> gave ${usersMessage} an award!`;

    const selfMention = toUserSlackHandles.length == 1 && toUserSlackHandles[0] == fromUserSlackHandle;

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
          // TODO: Change how images are handled. This is just temporary.
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

    await this.web.chat.postMessage(message);
  }

  // Function to join strings with commas + 'and'
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
