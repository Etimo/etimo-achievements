import { IContext } from '../../context';

export class DeleteBadgeAwardService {
  constructor(private context: IContext) {}

  public async delete(awardId: string) {
    const { repositories } = this.context;

    await repositories.badgeAward.delete(awardId);
  }
}
