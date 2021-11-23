import { Database } from '..';
import {
  INewUserAchievement,
  IPartialUserAchievement,
  IUserAchievement,
  UserAchievementModel,
} from '../models/user-achievement-model';
import { catchErrors } from '../utils';

export class UserAchievementRepository {
  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from "user_achievements"');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  findByUserId(id: string): Promise<Array<IUserAchievement>> {
    return catchErrors(async () => {
      return UserAchievementModel.query().where('user_id', id);
    });
  }

  findByAchievementId(id: string): Promise<Array<IUserAchievement>> {
    return catchErrors(async () => {
      return UserAchievementModel.query().where('achievement_id', id);
    });
  }

  create(userAchievement: INewUserAchievement): Promise<IUserAchievement> {
    return catchErrors(async () => {
      return UserAchievementModel.query().insert(userAchievement);
    });
  }

  update(userAchievement: IPartialUserAchievement): Promise<IUserAchievement> {
    return catchErrors(async () => {
      return UserAchievementModel.query().patchAndFetchById(userAchievement.id, userAchievement);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return UserAchievementModel.query().deleteById(id);
    });
  }

  getAll(skip: number, take: number): Promise<IUserAchievement[]> {
    return catchErrors(async () => {
      return UserAchievementModel.query().limit(take).offset(skip);
    });
  }
}
