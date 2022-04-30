import { IAchievement } from '@etimo-achievements/types';
import { getEnvVariable } from '@etimo-achievements/utils';
import { PlainTextOption, View, WebClient } from '@slack/web-api';
import { IContext } from '../..';

export class AwardSlackAchievementsService {
  private web: WebClient;

  constructor(private context: IContext) {
    this.web = new WebClient(getEnvVariable('SLACK_TOKEN'));
  }

  public async showModal(triggerId: string, channelId: string) {
    const { repositories, logger } = this.context;

    const achievements = await repositories.achievement.getAll();
    const view = this.generateView(channelId, achievements);
    try {
      await this.web.views.open({ view, trigger_id: triggerId });
    } catch (error: any) {
      logger.error(error);
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
