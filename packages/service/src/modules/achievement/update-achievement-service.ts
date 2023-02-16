import { NotFoundError } from '@etimo-achievements/common';
import { IAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class UpdateAchievementService {
  constructor(private context: IContext) {}

  public async update(achievement: IAchievement) {
    const { repositories } = this.context;

    const existingAchievement = await repositories.achievement.findById(achievement.id);
    if (!existingAchievement || existingAchievement.deletedAt) {
      throw new NotFoundError('Achievement not found');
    }

    await repositories.achievement.update(achievement);
  }
}
