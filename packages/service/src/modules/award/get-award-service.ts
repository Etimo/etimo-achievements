import { paginate, PaginatedData } from '@etimo-achievements/common';
import { IAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetAwardService {
  constructor(private context: IContext) {}

  public async getMany(skip: number, take: number): Promise<PaginatedData<IAward>> {
    const { repositories } = this.context;

    const awards = await repositories.award.getMany(skip, take);
    const count = await repositories.award.count();
    return paginate(awards, skip, take, count);
  }
}
