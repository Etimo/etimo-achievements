import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class UpdateAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async update(achievement: IAchievement) {
    await this.achievementRepo.update(achievement);
  }
}
