import { IContext } from '../..';

export class DeleteAchievementService {
  constructor(private context: IContext) {}

  public async delete(achievementId: string) {
    const { repositories } = this.context;

    await repositories.achievement.delete({ where: { id: achievementId } });
  }
}
