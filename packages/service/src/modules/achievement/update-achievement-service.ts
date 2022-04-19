import { AchievementRepository } from '@etimo-achievements/data';
import { IAchievement } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/types';

export class UpdateAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options: ServiceOptions) {
    this.achievementRepo = options.achievementRepository ?? new AchievementRepository();
  }

  public async update(achievement: IAchievement) {
    await this.achievementRepo.update(achievement);
  }
}
