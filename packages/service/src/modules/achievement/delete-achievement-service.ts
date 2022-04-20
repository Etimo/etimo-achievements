import { IContext } from '../..';

export class DeleteAchievementService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async delete(achievementId: string) {
    await this.repos.achievement.delete(achievementId);
  }
}
