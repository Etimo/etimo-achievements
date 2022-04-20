import { IContext } from '../../context';

export class DeleteAwardService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async delete(awardId: string) {
    await this.repos.award.delete(awardId);
  }
}
