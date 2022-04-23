import { camelToSnakeCase } from '@etimo-achievements/common';
import { IAward, INewAward, IRequestContext, PaginationOptions } from '@etimo-achievements/types';
import { Database } from '..';
import { AwardModel } from '../models/award-model';
import { catchErrors } from '../utils';

export class AwardRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from "awards"');
      return parseInt(result.rows[0]['count'], 10);
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
      if (!options.orderBy.length) {
        query.orderBy('created_at', 'desc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
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
