import { IAchievement, INewAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class CreateAchievementService {
  constructor(private context: IContext) {}

  public async create(achievement: INewAchievement): Promise<IAchievement> {
    const { repositories } = this.context;

    return await repositories.achievement.create(achievement);
  }
}
