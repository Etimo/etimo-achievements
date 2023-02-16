import { IContext } from '../..';

export class DeleteAchievementService {
  constructor(private context: IContext) {}

  public async delete(achievementId: string) {
    const { repositories } = this.context;

    const existingAchievement = await repositories.achievement.findById(achievementId);
    if (existingAchievement && !existingAchievement.deletedAt) {
      await repositories.achievement.updateById(achievementId, { deletedAt: new Date() });
    }
  }
}
