import { IAchievement } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AchievementModel } from '../models/achievement-model';
import {
  BaseRepository,
  CountOptions,
  CreateData,
  DeleteOptions,
  FindByIdOptions,
  FindOptions,
  UpdateOptions,
} from './base-repository';

export class AchievementRepository extends BaseRepository<AchievementModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AchievementModel(), Database.knex, transaction);
  }

  public async count(options: CountOptions<AchievementModel>): Promise<number> {
    return super.$count(options);
  }

  public async find(options: FindOptions<AchievementModel>): Promise<IAchievement[]> {
    return super.$find({ ...options, orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']] });
  }

  public async findById(id: string): Promise<IAchievement> {
    return super.$findById(id);
  }

  public async getAll(): Promise<IAchievement[]> {
    return super.$getAll();
  }

  public async create(data: CreateData<AchievementModel>): Promise<IAchievement> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<AchievementModel>): Promise<number> {
    return super.$delete(options);
  }

  public async findByIds(ids: string[], options: FindByIdOptions<AchievementModel>): Promise<IAchievement[]> {
    return super.$findByIds(ids, options);
  }

  public async update(data: Partial<AchievementModel>, options?: UpdateOptions<AchievementModel>): Promise<number> {
    return super.$update(data, options);
  }
}
