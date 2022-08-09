import { IAchievementFavorite, INewAchievementFavorite, IRequestContext } from '@etimo-achievements/types';
import { AchievementFavoriteModel } from '../models/achivement-favorites-model';
import { catchErrors } from '../utils';

export class AchievementFavoriteRepository {
  constructor(private context: IRequestContext) {}

  findManyByUserId(id: string): Promise<IAchievementFavorite[]> {
    return catchErrors(async () => {
      return AchievementFavoriteModel.query().where({ user_id: id });
    });
  }

  create(data: INewAchievementFavorite): Promise<IAchievementFavorite> {
    return catchErrors(async () => {
      return AchievementFavoriteModel.query().insert(data);
    });
  }

  delete(id: string, userId: string): Promise<number> {
    return catchErrors(async () => {
      return AchievementFavoriteModel.query().delete().where({ achievement_id: id, user_id: userId });
    });
  }
}
