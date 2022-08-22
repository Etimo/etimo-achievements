import { paginate, PaginatedData } from '@etimo-achievements/common';
import { IAward, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetAwardService {
  constructor(private context: IContext) {}

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IAward>> {
    const { repositories } = this.context;

    const awards = await repositories.award.find(options);
    const count = await repositories.award.count({ where: options.where ?? {} });
    return paginate(awards, count, options);
  }

  public async get(awardId: string): Promise<IAward> {
    const { repositories } = this.context;

    return repositories.award.findById(awardId);
  }
}
