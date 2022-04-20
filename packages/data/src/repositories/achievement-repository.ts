import { Logger } from '@etimo-achievements/common';
import { IAchievement, INewAchievement, IPartialAchievement, IRequestContext } from '@etimo-achievements/types';
import { Database } from '..';
import { AchievementModel } from '../models/achievement-model';
import { catchErrors } from '../utils';

export class AchievementRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from achievements');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  getAll(): Promise<IAchievement[]> {
    return catchErrors(async () => {
      return AchievementModel.query();
    });
  }

  getMany(skip: number, take: number): Promise<IAchievement[]> {
    return catchErrors(async () => {
      return AchievementModel.query().limit(take).offset(skip);
    });
  }

  getManyByIds(ids: string[]): Promise<IAchievement[]> {
    return catchErrors(async () => {
      return AchievementModel.query().whereIn('id', ids);
    });
  }

  findById(id: string): Promise<IAchievement | undefined> {
    return catchErrors(async () => {
      return AchievementModel.query().findById(id);
    });
  }

  create(achievement: INewAchievement): Promise<IAchievement> {
    Logger.log(JSON.stringify(achievement));
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
}
