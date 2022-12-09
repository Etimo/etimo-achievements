import { paginate, PaginatedData } from '@etimo-achievements/common';
import { ISeason, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetSeasonService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<ISeason>> {
    const seasons = await this.repos.seasons.find({});
    const count = await this.repos.seasons.count({});
    return paginate(seasons, count, options);
  }

  public async getActive(): Promise<ISeason[]> {
    return await this.repos.seasons.findActive();
  }
}
