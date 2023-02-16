import { IAward } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AwardModel } from '../models/award-model';
import { CreateData, FindByIdOptions, FindOptions } from '../types';
import { catchErrors } from '../utils';
import { BaseRepository } from './base-repository';

export class AwardRepository extends BaseRepository<AwardModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AwardModel(), Database.knex, transaction);
  }

  public findLatest(userId: string, achievementId: string): Promise<IAward | undefined> {
    return catchErrors(() => {
      return this.model.query().orderBy('created_at', 'desc').findOne({
        user_id: userId,
        achievement_id: achievementId,
      });
    });
  }

  public findLatestAnyUser(achievementId: string): Promise<IAward | undefined> {
    return catchErrors(() => {
      return this.model.query().orderBy('created_at', 'desc').findOne({
        achievement_id: achievementId,
      });
    });
  }

  public findAwardedBetween(start: Date, end: Date, userId?: string): Promise<IAward[]> {
    return catchErrors(() => {
      const query = this.model.query().where(function () {
        this.where('created_at', '>=', start).andWhere('created_at', '<=', end);
      });
      if (userId) {
        query.andWhere(function () {
          this.where('user_id', userId).orWhere('awarded_by_user_id', userId);
        });
      }

      return query;
    });
  }

  public find(options: FindOptions<AwardModel>): Promise<IAward[]> {
    return super.$get({
      ...options,
      orderBy: options.orderBy?.length !== 0 ? options.orderBy : [['created_at', 'desc']],
    });
  }

  public findById(id: string): Promise<IAward> {
    return super.$findById(id);
  }

  public getAll(): Promise<IAward[]> {
    return super.$get();
  }

  public create(data: CreateData<AwardModel>): Promise<IAward> {
    return super.$create(data);
  }

  public findByIds(ids: string[], options: FindByIdOptions<AwardModel>): Promise<IAward[]> {
    return super.$getByIds(ids, options);
  }
}
