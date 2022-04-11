import { paginate, PaginatedData } from '@etimo-achievements/common';
import { AwardRepository } from '@etimo-achievements/data';
import { IAward } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class GetAwardService {
  private awardRepo: AwardRepository;

  constructor(options?: ServiceOptions) {
    this.awardRepo = options?.awardRepository ?? new AwardRepository();
  }

  public async getMany(skip: number, take: number): Promise<PaginatedData<IAward>> {
    const users = await this.awardRepo.getAll(skip, take);
    const count = await this.awardRepo.count();
    return paginate(users, skip, take, count);
  }
}
