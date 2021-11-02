import { AchievementRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class DeleteAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async delete(achievementId: string) {
    await this.achievementRepo.delete(achievementId);
  }
}
