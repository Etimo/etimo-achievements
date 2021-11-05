import { AchievementRepository, IAchievement, INewAchievement } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/service-options';

export class CreateAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async create(achievement: INewAchievement): Promise<IAchievement> {
    return await this.achievementRepo.create(achievement);
  }
}
