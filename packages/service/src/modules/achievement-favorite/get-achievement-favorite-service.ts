import { IAchievementFavorite } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetAchievementFavoriteService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(userId: string): Promise<IAchievementFavorite[]> {
    const achievementFavorites = await this.repos.achievementFavorite.findManyByUserId(userId);
    return achievementFavorites;
  }
}
