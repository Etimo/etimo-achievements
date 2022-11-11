import { IBadge } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { BadgeModel } from '../models/badge-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class BadgeRepository extends BaseRepository<BadgeModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new BadgeModel(), Database.knex, transaction);
  }

  public find(options: FindOptions<BadgeModel>): Promise<IBadge[]> {
    return super.$get({
      ...options,
      orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['name', 'asc']],
    });
  }

  public findById(id: string): Promise<IBadge> {
    return super.$findById(id);
  }

  public create(data: CreateData<BadgeModel>): Promise<IBadge> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<BadgeModel>): Promise<IBadge[]> {
    return super.$getByIds(ids, options);
  }
}
