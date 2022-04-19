import { AwardRepository } from '@etimo-achievements/data';
import { ServiceOptions } from '../common/types';

export class DeleteAwardService {
  private awardRepo: AwardRepository;

  constructor(options: ServiceOptions) {
    this.awardRepo = options.awardRepository ?? new AwardRepository();
  }

  public async delete(awardId: string) {
    await this.awardRepo.delete(awardId);
  }
}
