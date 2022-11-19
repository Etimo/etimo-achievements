import { ISeason } from '@etimo-achievements/types';
import { IContext } from '../../context';

export class UpdateSeasonService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async update(data: ISeason) {
    await this.repos.seasons.update(data);
  }
}
