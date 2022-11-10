import { IBadge } from '@etimo-achievements/types';
import { IContext } from '../..';

export class UpdateBadgeService {
  constructor(private context: IContext) {}

  public async update(badge: IBadge) {
    const { repositories } = this.context;

    await repositories.badge.update(badge);
  }
}
