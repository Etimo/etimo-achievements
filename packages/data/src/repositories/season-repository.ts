import { ISeason } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { SeasonModel } from '../models/season-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { catchErrors } from '../utils';
import { BaseRepository } from './base-repository';

export class SeasonRepository extends BaseRepository<SeasonModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new SeasonModel(), Database.knex, transaction);
  }

  public findBy(filter: Partial<SeasonModel>): Promise<ISeason | undefined> {
    return catchErrors(() => {
      return this.model.query().findOne(filter);
    });
  }

  public getBy(filter: Partial<SeasonModel>, options?: FindOptions<SeasonModel>): Promise<ISeason[]> {
    return super.$getBy(filter, options);
  }

  public findActive(): Promise<ISeason[]> {
    return this.findActiveAtTimestamp(new Date());
  }

  public findActiveAtTimestamp(date: Date): Promise<ISeason[]> {
    const isoDateStr = date.toISOString();
    return catchErrors(() => {
      return this.model.query().where('starts_at', '<=', isoDateStr).andWhere('ends_at', '>=', isoDateStr);
    });
  }

  public find(options: FindOptions<SeasonModel>): Promise<ISeason[]> {
    return super.$get({
      ...options,
      orderBy:
        options?.orderBy && options.orderBy.length !== 0
          ? options.orderBy
          : [
              ['startsAt', 'desc'],
              ['endsAt', 'desc'],
            ],
    });
  }

  public findById(id: string): Promise<ISeason> {
    return super.$findById(id);
  }

  public getAll(): Promise<ISeason[]> {
    return super.$get();
  }

  public create(data: CreateData<SeasonModel>): Promise<ISeason> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<SeasonModel>): Promise<ISeason[]> {
    return super.$getByIds(ids, options);
  }
}
