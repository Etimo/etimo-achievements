import { IDailyScore } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { DailyScoreModel } from '../models/daily-score-model';
import { CreateData, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class DailyScoreRepository extends BaseRepository<DailyScoreModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new DailyScoreModel(), Database.knex, transaction);
  }

  public create(data: CreateData<DailyScoreModel>): Promise<IDailyScore> {
    return super.$create(data);
  }

  public findByUserAndSeason(userId: string, seasonId: string): Promise<IDailyScore[]> {
    return this.model.query().where('user_id', userId).andWhere('season_id', seasonId);
  }

  public async findByUserAndDay(userId: string, seasonId: string, date: Date): Promise<IDailyScore[]> {
    return await this.model.query().where('user_id', userId).andWhere('season_id', seasonId).andWhere('date', date);
  }

  public getBy(filter: Partial<DailyScoreModel>, options?: FindOptions<DailyScoreModel>): Promise<IDailyScore[]> {
    return super.$getBy(filter, options);
  }
}
