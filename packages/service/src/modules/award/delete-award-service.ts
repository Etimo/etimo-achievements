import { IContext } from '../../context';

export class DeleteAwardService {
  constructor(private context: IContext) {}

  public async delete(awardId: string) {
    const { repositories } = this.context;

    await repositories.award.delete({ where: { id: awardId } });
  }
}
