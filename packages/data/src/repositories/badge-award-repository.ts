import { IBadgeAward } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { BadgeAwardModel } from '../models/badge-award-model';
import {
  BaseRepository,
  CountOptions,
  CreateData,
  DeleteOptions,
  FindByIdOptions,
  FindOptions,
  UpdateOptions,
} from './base-repository';

export class BadgeAwardRepository extends BaseRepository<BadgeAwardModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new BadgeAwardModel(), Database.knex, transaction);
  }

  public async count(options: CountOptions<BadgeAwardModel>): Promise<number> {
    return super.$count(options);
  }

  public async find(options: FindOptions<BadgeAwardModel>): Promise<IBadgeAward[]> {
    return super.$find({
      ...options,
      orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['created_at', 'desc']],
    });
  }

  public async findById(id: string): Promise<IBadgeAward> {
    return super.$findById(id);
  }

  public async getAll(): Promise<IBadgeAward[]> {
    return super.$getAll();
  }

  public async create(data: CreateData<BadgeAwardModel>): Promise<IBadgeAward> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<BadgeAwardModel>): Promise<number> {
    return super.$delete(options);
  }

  public async findByIds(ids: string[], options: FindByIdOptions<BadgeAwardModel>): Promise<IBadgeAward[]> {
    return super.$findByIds(ids, options);
  }

  public async update(data: Partial<BadgeAwardModel>, options?: UpdateOptions<BadgeAwardModel>): Promise<number> {
    return super.$update(data, options);
  }
}
