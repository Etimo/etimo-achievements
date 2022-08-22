import { IAward } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AwardModel } from '../models/award-model';
import { catchErrors } from '../utils';
import {
  BaseRepository,
  CountOptions,
  CreateData,
  DeleteOptions,
  FindByIdOptions,
  FindOptions,
  UpdateOptions,
} from './base-repository';

export class AwardRepository extends BaseRepository<AwardModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AwardModel(), Database.knex, transaction);
  }

  public async findLatest(userId: string, achievementId: string): Promise<IAward | undefined> {
    return catchErrors(async () => {
      return this.model.query().orderBy('created_at', 'desc').findOne({
        user_id: userId,
        achievement_id: achievementId,
      });
    });
  }

  public async count(options: CountOptions<AwardModel>): Promise<number> {
    return super.$count(options);
  }

  public async find(options: FindOptions<AwardModel>): Promise<IAward[]> {
    return super.$find(options);
  }

  public async findById(id: string): Promise<IAward> {
    return super.$findById(id);
  }

  public async getAll(): Promise<IAward[]> {
    return super.$getAll();
  }

  public async create(data: CreateData<AwardModel>): Promise<IAward> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<AwardModel>): Promise<number> {
    return super.$delete(options);
  }

  public async findByIds(ids: string[], options: FindByIdOptions<AwardModel>): Promise<IAward[]> {
    return super.$findByIds(ids, options);
  }

  public async update(data: Partial<AwardModel>, options?: UpdateOptions<AwardModel>): Promise<number> {
    return super.$update(data, options);
  }
}
