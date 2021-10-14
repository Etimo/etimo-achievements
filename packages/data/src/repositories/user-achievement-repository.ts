import {
  IUserAchievement,
  INewUserAchievement,
  IPartialUserAchievement,
  UserAchievementModel,
} from '../models/user-achievement-model';

export class UserAchievementRepository {
  findByUserId(id: string): Promise<Array<IUserAchievement>> {
    return UserAchievementModel.query().where('user_id', id);
  }

  findByAchievementId(id: string): Promise<Array<IUserAchievement>> {
    return UserAchievementModel.query().where('achievement_id', id);
  }

  create(userAchievement: INewUserAchievement): Promise<IUserAchievement> {
    return UserAchievementModel.query().insert(userAchievement);
  }

  update(userAchievement: IPartialUserAchievement): Promise<IUserAchievement> {
    return UserAchievementModel.query().patchAndFetchById(userAchievement.id, userAchievement);
  }

  delete(id: string): Promise<number> {
    return UserAchievementModel.query().deleteById(id);
  }

  getAll(): Promise<Array<IUserAchievement>> {
    return UserAchievementModel.query();
  }
}
