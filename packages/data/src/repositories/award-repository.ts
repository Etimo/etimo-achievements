import { camelToSnakeCase } from '@etimo-achievements/common';
import { IAward, INewAward, IRequestContext, PaginationOptions } from '@etimo-achievements/types';
import { AwardModel } from '../models/award-model';
import { catchErrors } from '../utils';
import { applyWhereFiltersFnCreator } from '../utils/filter-helpers';

const applyFilters = applyWhereFiltersFnCreator<AwardModel>(['achievementId', 'userId', 'awardedByUserId']);

export class AwardRepository {
  constructor(private context: IRequestContext) {}

  async count(whereOptions?: Record<string, any>): Promise<number> {
    return catchErrors(async () => {
      const query = AwardModel.query().count();

      applyFilters(query, whereOptions);

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

      applyFilters(query, options.filters);

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
