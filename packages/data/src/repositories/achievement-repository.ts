import { Database } from '..';
import { IAchievement, INewAchievement, IPartialAchievement, AchievementModel } from '../models/achievement-model';

export class AchievementRepository {
  async count(): Promise<number> {
    const result = await Database.knex.raw('select count(*) from achievements');
    return parseInt(result.rows[0]['count'], 10);
  }

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

  getAll(skip: number, take: number): Promise<IAchievement[]> {
    return AchievementModel.query().limit(take).offset(skip);
  }
}
