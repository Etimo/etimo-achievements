import { INewUserAchievement, IUserAchievement, UserAchievementRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class CreateAwardsService {
  private userAchievementRepo: UserAchievementRepository;

  constructor(options?: ServiceOptions) {
    this.userAchievementRepo = options?.userAchievementRepository ?? new UserAchievementRepository();
  }

  public async create(award: INewUserAchievement): Promise<IUserAchievement> {
    try {
      return await this.userAchievementRepo.create(award);
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
}
