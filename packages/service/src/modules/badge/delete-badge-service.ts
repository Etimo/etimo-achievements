import { IContext } from '../..';

export class DeleteBadgeService {
  constructor(private context: IContext) {}

  public async delete(badgeId: string) {
    const { repositories } = this.context;

    await repositories.badge.delete(badgeId);
  }
}
