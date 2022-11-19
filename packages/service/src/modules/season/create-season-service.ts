import { INewSeason, ISeason } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class CreateSeasonService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async create(data: INewSeason): Promise<ISeason> {
    const { repositories } = this.context;
    console.log(data);
    return await repositories.seasons.create(data);
  }
}
