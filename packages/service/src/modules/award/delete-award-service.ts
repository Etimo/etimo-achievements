import { IContext } from '../../context';

export class DeleteAwardService {
  constructor(private context: IContext) {}

  public async delete(awardId: string) {
    const { repositories, notifier } = this.context;

    const award = await repositories.award.findById(awardId);
    if (award) {
      await repositories.award.delete({ where: { id: awardId } });

      if (award.messageId) {
        await notifier.delete(award.messageId);
      }
    }
  }
}
