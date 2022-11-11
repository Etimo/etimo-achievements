import { IAchievement } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AchievementModel } from '../models/achievement-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class AchievementRepository extends BaseRepository<AchievementModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AchievementModel(), Database.knex, transaction);
  }

  public find(options: FindOptions<AchievementModel>): Promise<IAchievement[]> {
    return super.$get({ ...options, orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']] });
  }

  public findById(id: string): Promise<IAchievement> {
    return super.$findById(id);
  }

  public getAll(): Promise<IAchievement[]> {
    return super.$get();
  }

  public create(data: CreateData<AchievementModel>): Promise<IAchievement> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<AchievementModel>): Promise<IAchievement[]> {
    return super.$getByIds(ids, options);
  }
}
