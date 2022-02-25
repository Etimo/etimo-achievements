import { AwardRepository } from '@etimo-achievements/data';
import { IAward, INewAward } from '@etimo-achievements/types';
import { ServiceOptions } from '../common/service-options';

export class CreateAwardService {
  private awardRepo: AwardRepository;

  constructor(options?: ServiceOptions) {
    this.awardRepo = options?.awardRepository ?? new AwardRepository();
  }

  public async create(award: INewAward): Promise<IAward> {
    return await this.awardRepo.create(award);
  }

  public async createMultiple(awards: INewAward[]): Promise<IAward[]> {
    return await this.awardRepo.createMultiple(awards);
  }
}
