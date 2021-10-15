import { AchievementRepository, IAchievement } from '@etimo-achievements/data';
import { ConflictError } from '../errors';
import { ServiceOptions } from '../service-options';

export class CreateAchievementService {
  private achievementRepo: AchievementRepository;

  constructor(options?: ServiceOptions) {
    this.achievementRepo = options?.achievementRepository ?? new AchievementRepository();
  }

  public async create(achievement: IAchievement): Promise<IAchievement> {
    try {
      return await this.achievementRepo.create(achievement);
    } catch (error: any) {
      console.log(error);
      if (error.code == '23505') {
        throw new ConflictError('Achievement already exists');
      }
      throw error;
    }
  }
}
