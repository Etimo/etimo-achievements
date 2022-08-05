import { NotImplementedError } from '@etimo-achievements/common';
import { IBadge, INewBadgeAward } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class GiveBadgeService {
  constructor(private context: IContext) {}

  public async give(award: INewBadgeAward): Promise<IBadge> {
    const { repositories, notifier } = this.context;
    throw new NotImplementedError('');
  }
}
