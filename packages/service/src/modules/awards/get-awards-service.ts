import { paginate, PaginationType } from '@etimo-achievements/common';
import { IUserAchievement, UserAchievementRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class GetAwardsService {
  private userAchievementRepo: UserAchievementRepository;

  constructor(options?: ServiceOptions) {
    this.userAchievementRepo = options?.userAchievementRepository ?? new UserAchievementRepository();
  }

  public async getAll(skip: number, take: number): Promise<PaginationType<IUserAchievement>> {
    const users = await this.userAchievementRepo.getAll(skip, take);
    const count = await this.userAchievementRepo.count();
    return paginate(users, skip, take, count);
  }
}
