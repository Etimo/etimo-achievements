import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '..';
import { showModal } from './utils';

export class ShowSlackAchievementsService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async show() {
    const achievements = await this.achievementRepo.getAll();
    const view = this.generateView(achievements);
    await showModal(view);
  }

  private generateView = (achievements: Array<IAchievement>) => {
    return {
      trigger_id: 'trigger_id',
      view: {
        type: 'modal',
        callback_id: 'show-achievements',
        title: {
          type: 'plain_text',
          text: 'Obama',
          emoji: true,
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
          emoji: true,
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: 'A list of all achievements!',
              emoji: true,
            },
          },
          {
            type: 'divider',
          },
        ],
      },
    };
  };
}
