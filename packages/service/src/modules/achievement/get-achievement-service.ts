import { NotFoundError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IAchievement, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetAchievementService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IAchievement>> {
    const achievements = await this.repos.achievement.find(options);
    const count = await this.repos.achievement.count({});
    const existingAchievements = achievements.filter((a) => !a.deletedAt);

    return paginate(existingAchievements, count, options);
  }

  public async getManyByIds(ids: string[]): Promise<IAchievement[]> {
    const achievements = await this.repos.achievement.findByIds(ids, {});
    const existingAchievements = achievements.filter((a) => !a.deletedAt);
    return existingAchievements;
  }

  public async get(id: string): Promise<IAchievement> {
    const achievement = await this.repos.achievement.findById(id);
    if (!achievement || achievement.deletedAt) {
      throw new NotFoundError('Achievement not found');
    }

    return achievement;
  }
}
