import { INewSeason, ISeason } from '@etimo-achievements/types';
import { IContext } from '../..';

export class CreateSeasonService {
  constructor(private context: IContext) {}

  public async create(season: INewSeason): Promise<ISeason> {
    const { repositories } = this.context;

    return await repositories.season.create(season);
  }
}
