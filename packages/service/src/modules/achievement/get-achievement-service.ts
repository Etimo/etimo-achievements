import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class GetAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async get(achievement: IAchievement) {
    await this.achievementRepo.findById(achievement.id);
  }
}
