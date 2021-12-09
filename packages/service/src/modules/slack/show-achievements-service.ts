import { Logger } from '@etimo-achievements/common';
import { AchievementRepository } from '@etimo-achievements/data';
import { IAchievement } from '@etimo-achievements/types';
import { PlainTextOption, View, WebClient } from '@slack/web-api';
import { ServiceOptions } from '..';

export class ShowSlackAchievementsService {
  private achievementRepo: AchievementRepository;
  private web: WebClient;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();

    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async show(triggerId: string, skip: number, take: number) {
    const achievements = await this.achievementRepo.getAll(skip, take);
    const view = this.generateView(achievements);
    try {
      const result = await this.web.views.open({ view, trigger_id: triggerId });
      Logger.log(JSON.stringify(result));
    } catch (error: any) {
      Logger.log(error);
    }
  }

  private generateView(achievements: IAchievement[]): View {
    const achievementOptions: PlainTextOption[] = achievements.map((a) => ({
      text: {
        type: 'plain_text',
        text: `${a.achievement}: ${a.description}`,
        emoji: true,
      },
      value: 'value-0',
    }));
    return {
      title: {
        type: 'plain_text',
        text: 'Achievements',
      },
      submit: {
        type: 'plain_text',
        text: 'Award',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Select an achievement',
          },
          accessory: {
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select an achievement',
              emoji: true,
            },
            options: achievementOptions,
            action_id: 'static_select-action',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Award to user',
          },
          accessory: {
            type: 'users_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select a user',
              emoji: true,
            },
            action_id: 'users_select-action',
          },
        },
      ],
      type: 'modal',
    };
  }
}
