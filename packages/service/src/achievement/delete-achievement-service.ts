import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class DeleteAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async delete(achievement: IAchievement) {
    await this.achievementRepo.delete(achievement.id);
  }
}
