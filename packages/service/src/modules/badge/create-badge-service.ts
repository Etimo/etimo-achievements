import { IBadge, INewBadge } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class CreateBadgeService {
  constructor(private context: IContext) {}

  public async create(badge: INewBadge): Promise<IBadge> {
    const { repositories } = this.context;

    return await repositories.badge.create(badge);
  }
}
