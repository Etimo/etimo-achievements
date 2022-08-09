import { IAchievementFavorite, INewAchievementFavorite } from '@etimo-achievements/types';
import { IContext } from '../..';

export class CreateAchievementFavoriteService {
  constructor(private context: IContext) {}

  public async create(favorite: INewAchievementFavorite): Promise<IAchievementFavorite> {
    const { repositories } = this.context;

    return await repositories.achievementFavorite.create(favorite);
  }
}
