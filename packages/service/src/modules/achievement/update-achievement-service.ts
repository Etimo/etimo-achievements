import { IAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class UpdateAchievementService {
  constructor(private context: IContext) {}

  public async update(achievement: IAchievement) {
    const { repositories } = this.context;

    await repositories.achievement.update(achievement);
  }
}
