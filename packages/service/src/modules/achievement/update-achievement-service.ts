import { IAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class UpdateAchievementService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async update(achievement: IAchievement) {
    await this.repos.achievement.update(achievement);
  }
}
