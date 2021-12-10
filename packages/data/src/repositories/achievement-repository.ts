import { IAchievement, INewAchievement, IPartialAchievement } from '@etimo-achievements/types';
import { Database } from '..';
import { AchievementModel } from '../models/achievement-model';
import { catchErrors } from '../utils';

export class AchievementRepository {
  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from achievements');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  findById(id: string): Promise<IAchievement> {
    return catchErrors(async () => {
      return AchievementModel.query().findById(id);
    });
  }

  findByAchievementName(achievement: string): Promise<IAchievement> {
    return catchErrors(async () => {
      return AchievementModel.query().findOne({ achievement });
    });
  }

  create(achievement: INewAchievement): Promise<IAchievement> {
    return catchErrors(async () => {
      return AchievementModel.query().insert(achievement);
    });
  }

  update(achievement: IPartialAchievement): Promise<IAchievement> {
    return catchErrors(async () => {
      return AchievementModel.query().patchAndFetchById(achievement.id, achievement);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AchievementModel.query().deleteById(id);
    });
  }

  getMany(skip: number, take: number): Promise<IAchievement[]> {
    return catchErrors(async () => {
      return AchievementModel.query().limit(take).offset(skip);
    });
  }

  getAll(): Promise<IAchievement[]> {
    return catchErrors(async () => {
      return AchievementModel.query();
    });
  }
}
