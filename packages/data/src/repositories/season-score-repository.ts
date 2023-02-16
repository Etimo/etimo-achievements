import { ISeasonScore } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { SeasonScoreModel } from '../models/season-score-model';
import { CreateData, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class SeasonScoreRepository extends BaseRepository<SeasonScoreModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new SeasonScoreModel(), Database.knex, transaction);
  }

  public create(data: CreateData<SeasonScoreModel>): Promise<ISeasonScore> {
    return super.$create(data);
  }

  public getBy(filter: Partial<SeasonScoreModel>, options?: FindOptions<SeasonScoreModel>): Promise<ISeasonScore[]> {
    return super.$getBy(filter, options);
  }

  public async getByUserAndSeason(userId: string, seasonId: string) {
    return this.model.query().where('user_id', userId).andWhere('season_id', seasonId).first();
  }

  public updateByUserAndSeason(userId: string, seasonId: string, partialModel: Partial<SeasonScoreModel>) {
    return this.update(partialModel, { where: { userId, seasonId } });
  }
}
