import { UserAchievementRepository } from '@etimo-achievements/data';
import { INewUserAchievement, IUserAchievement } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class CreateAwardsService {
  private userAchievementRepo: UserAchievementRepository;

  constructor(options?: ServiceOptions) {
    this.userAchievementRepo = options?.userAchievementRepository ?? new UserAchievementRepository();
  }

  public async create(award: INewUserAchievement): Promise<IUserAchievement> {
    return await this.userAchievementRepo.create(award);
  }
}
