import { IBadge } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { BadgeModel } from '../models/badge-model';
import {
  BaseRepository,
  CountOptions,
  CreateData,
  DeleteOptions,
  FindByIdOptions,
  FindOptions,
  UpdateOptions,
} from './base-repository';

export class BadgeRepository extends BaseRepository<BadgeModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new BadgeModel(), Database.knex, transaction);
  }

  public async count(options: CountOptions<BadgeModel>): Promise<number> {
    return super.$count(options);
  }

  public async find(options: FindOptions<BadgeModel>): Promise<IBadge[]> {
    return super.$find({
      ...options,
      orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']],
    });
  }

  public async findById(id: string): Promise<IBadge> {
    return super.$findById(id);
  }

  public async getAll(): Promise<IBadge[]> {
    return super.$getAll();
  }

  public async create(data: CreateData<BadgeModel>): Promise<IBadge> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<BadgeModel>): Promise<number> {
    return super.$delete(options);
  }

  public async findByIds(ids: string[], options: FindByIdOptions<BadgeModel>): Promise<IBadge[]> {
    return super.$findByIds(ids, options);
  }

  public async update(data: Partial<BadgeModel>, options?: UpdateOptions<BadgeModel>): Promise<number> {
    return super.$update(data, options);
  }
}
