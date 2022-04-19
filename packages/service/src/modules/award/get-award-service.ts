import { paginate, PaginatedData } from '@etimo-achievements/common';
import { IAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetAwardService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async getMany(skip: number, take: number): Promise<PaginatedData<IAward>> {
    const awards = await this.repos.award.getMany(skip, take);
    const count = await this.repos.award.count();
    return paginate(awards, skip, take, count);
  }
}
