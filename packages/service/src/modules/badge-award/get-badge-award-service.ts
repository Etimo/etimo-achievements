import { paginate, PaginatedData } from '@etimo-achievements/common';
import { IBadgeAward, PaginationOptions } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GetBadgeAwardService {
  constructor(private context: IContext) {}

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IBadgeAward>> {
    const { repositories } = this.context;

    const awards = await repositories.badgeAward.getMany(options);
    const count = await repositories.badgeAward.count();
    return paginate(awards, count, options);
  }

  public async get(awardId: string): Promise<IBadgeAward> {
    const { repositories } = this.context;

    return repositories.badgeAward.findById(awardId);
  }
}
