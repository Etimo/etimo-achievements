import { camelToSnakeCase } from '@etimo-achievements/common';
import { IAward, INewAward, IRequestContext, PaginationOptions } from '@etimo-achievements/types';
import { AwardModel } from '../models/award-model';
import { catchErrors } from '../utils';
import { toWhereObject } from '../utils/filter-helpers';

export class AwardRepository {
  constructor(private context: IRequestContext) {}

  async count(whereOptions?: Record<string, any>): Promise<number> {
    return catchErrors(async () => {
      const query = AwardModel.query();

      if (whereOptions && Object.keys(whereOptions).length !== 0) {
        const w = toWhereObject(whereOptions);
        if (w.where) {
          query.where(w.where);
        }
        if (w.whereNot) {
          query.whereNot(w.whereNot);
        }
      }

      query.count();

      const result = await query;
      return parseInt((result[0] as any)['count'], 10);
    });
  }

  getAll(): Promise<IAward[]> {
    return catchErrors(async () => {
      return AwardModel.query().select();
    });
  }

  getMany(options: PaginationOptions): Promise<IAward[]> {
    return catchErrors(async () => {
      const query = AwardModel.query().limit(options.take).offset(options.skip);
      const where: Record<string, any> = {};
      if (options.filters?.achievementId) {
        where['achievement_id'] = options.filters.achievementId;
      }
      if (options.filters?.userId) {
        where['user_id'] = options.filters.userId;
      }
      if (options.filters?.awardedByUserId) {
        where['awarded_by_user_id'] = options.filters.awardedByUserId;
      }

      if (Object.keys(where).length !== 0) {
        const w = toWhereObject(where);
        if (w.where) {
          query.where(w.where);
        }
        if (w.whereNot) {
          query.whereNot(w.whereNot);
        }
      }

      if (!options.orderBy.length) {
        query.orderBy('created_at', 'desc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  findById(awardId: string): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().findById(awardId);
    });
  }

  findLatest(userId: string, achievementId: string): Promise<IAward | undefined> {
    return catchErrors(async () => {
      return AwardModel.query().orderBy('created_at', 'desc').findOne({
        user_id: userId,
        achievement_id: achievementId,
      });
    });
  }

  create(award: INewAward): Promise<IAward> {
    return catchErrors(async () => {
      return AwardModel.query().insert(award);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AwardModel.query().deleteById(id);
    });
  }
}
