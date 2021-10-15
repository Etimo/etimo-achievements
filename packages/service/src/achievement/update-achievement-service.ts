import { AchievementRepository, IUser } from '@etimo-achievements/data';
import { ServiceOptions } from '../service-options';

export class UpdateAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async update(user: IUser) {
    await this.achievementRepo.update(user);
  }
}
