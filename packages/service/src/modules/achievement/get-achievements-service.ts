import { paginate, PaginationType } from '@etimo-achievements/common';
import { AchievementRepository } from '@etimo-achievements/data';
import { IAchievement } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class GetAchievementsService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async getAll(skip: number, take: number): Promise<PaginationType<IAchievement>> {
    const achievements = await this.achievementRepo.getAll(skip, take);
    const count = await this.achievementRepo.count();
    return paginate(achievements, skip, take, count);
  }
}
