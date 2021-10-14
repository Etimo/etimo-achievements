import { IAchievement, INewAchievement, IPartialAchievement, AchievementModel } from '../models/achievement-model';

export class AchievementRepository {
  findById(id: string): Promise<IAchievement> {
    return AchievementModel.query().findById(id);
  }

  findByAchievementName(achievement: string): Promise<IAchievement> {
    return AchievementModel.query().findOne({ achievement });
  }

  create(achievement: INewAchievement): Promise<IAchievement> {
    return AchievementModel.query().insert(achievement);
  }

  update(achievement: IPartialAchievement): Promise<IAchievement> {
    return AchievementModel.query().patchAndFetchById(achievement.id, achievement);
  }

  delete(id: string): Promise<number> {
    return AchievementModel.query().deleteById(id);
  }
}
