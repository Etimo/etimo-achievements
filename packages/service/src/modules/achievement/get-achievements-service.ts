import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';
import { paginate, PaginationType } from '@etimo-achievements/common';

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
