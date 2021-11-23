import { AchievementRepository } from '@etimo-achievements/data';
import { IAchievement } from '@etimo-achievements/types';
import { ServiceOptions } from '..';
import { openSlackView } from './utils';

export class ShowSlackAchievementsService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async show() {
    const skip: number = 0;
    const take: number = 50;
    const achievements = await this.achievementRepo.getAll(skip, take);
    const view = this.generateView(achievements);
    await openSlackView(view);
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
