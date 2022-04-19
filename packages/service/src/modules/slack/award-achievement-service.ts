import { Logger } from '@etimo-achievements/common';
import { AchievementRepository } from '@etimo-achievements/data';
import { IAchievement } from '@etimo-achievements/types';
import { PlainTextOption, View, WebClient } from '@slack/web-api';
import { ServiceOptions } from '..';

export class AwardSlackAchievementsService {
  private achievementRepo: AchievementRepository;
  private web: WebClient;

  constructor(options: ServiceOptions) {
    this.achievementRepo = options.achievementRepository ?? new AchievementRepository();

    const token = process.env.SLACK_TOKEN;
    this.web = new WebClient(token);
  }

  public async showModal(triggerId: string, channelId: string) {
    const achievements = await this.achievementRepo.getAll();
    const view = this.generateView(channelId, achievements);
    try {
      const result = await this.web.views.open({ view, trigger_id: triggerId });
    } catch (error: any) {
      Logger.log(error);
    }
  }

  private generateView(channelId: string, achievements: IAchievement[]): View {
    const achievementOptions: PlainTextOption[] = achievements.map((a) => ({
      text: {
        type: 'plain_text',
        text: `:trophy: ${a.name}: ${a.description}`,
        emoji: true,
      },
      value: a.id,
    }));

    return {
      callback_id: 'award-achievement',
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
          type: 'input',
          block_id: 'achievement-input',
          element: {
            type: 'static_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select an achievement',
              emoji: true,
            },
            options: achievementOptions,
            action_id: 'static_select-action',
          },
          label: {
            type: 'plain_text',
            text: 'Select an achievement to award',
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: 'user-input',
          element: {
            type: 'multi_users_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select users',
              emoji: true,
            },
            action_id: 'multi_users_select-action',
          },
          label: {
            type: 'plain_text',
            text: 'Select users to award',
            emoji: true,
          },
        },
      ],
      type: 'modal',
      private_metadata: JSON.stringify({ channelId }),
    };
  }
}
