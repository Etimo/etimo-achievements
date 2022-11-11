import { IBadgeAward } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { BadgeAwardModel } from '../models/badge-award-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class BadgeAwardRepository extends BaseRepository<BadgeAwardModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new BadgeAwardModel(), Database.knex, transaction);
  }

  public find(options: FindOptions<BadgeAwardModel>): Promise<IBadgeAward[]> {
    return super.$get({
      ...options,
      orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['created_at', 'desc']],
    });
  }

  public findById(id: string): Promise<IBadgeAward> {
    return super.$findById(id);
  }

  public create(data: CreateData<BadgeAwardModel>): Promise<IBadgeAward> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<BadgeAwardModel>): Promise<IBadgeAward[]> {
    return super.$getByIds(ids, options);
  }
}
