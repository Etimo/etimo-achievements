import { NotFoundError, paginate, PaginatedData } from '@etimo-achievements/common';
import { IAchievement } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetAchievementService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(skip: number, take: number): Promise<PaginatedData<IAchievement>> {
    const achievements = await this.repos.achievement.getMany(skip, take);
    const count = await this.repos.achievement.count();
    return paginate(achievements, skip, take, count);
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
