import { NotFoundError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IAchievement, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetAchievementService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IAchievement>> {
    const achievements = await this.repos.achievement.getMany(options);
    const count = await this.repos.achievement.count();

    return paginate(achievements, count, options);
  }

  public async getManyByIds(ids: string[]): Promise<IAchievement[]> {
    const achievements = await this.repos.achievement.getManyByIds(ids);
    return achievements;
  }

  public async get(id: string): Promise<IAchievement> {
    const achievement = await this.repos.achievement.findById(id);
    if (!achievement) {
      throw new NotFoundError('Achievement not found');
    }

    return achievement;
  }
}
