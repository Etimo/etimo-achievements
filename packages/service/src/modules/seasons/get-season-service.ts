import { paginate, PaginatedData } from '@etimo-achievements/common';
import { ISeason, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetSeasonService {
  constructor(private context: IContext) {}

  public async getMany(options: PaginationOptions): Promise<PaginatedData<ISeason>> {
    const { repositories } = this.context;

    const data = await repositories.season.getMany(options);
    const count = await repositories.season.count();

    return paginate(data, count, options);
  }

  public async getCurrent(options: PaginationOptions): Promise<PaginatedData<ISeason>> {
    const { repositories } = this.context;

    const data = await repositories.season.getManyCurrent(options);
    const count = await repositories.season.countCurrent();

    return paginate(data, count, options);
  }
}
