import { IContext } from '../..';

export class DeleteAchievementFavoriteService {
  constructor(private context: IContext) {}

  public async delete(achievementId: string, userId: string) {
    const { repositories } = this.context;

    await repositories.achievementFavorite.delete(achievementId, userId);
  }
}
