import { IAchievement, INewAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class CreateAchievementService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async create(achievement: INewAchievement): Promise<IAchievement> {
    return await this.repos.achievement.create(achievement);
  }
}
