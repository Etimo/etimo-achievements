import { camelToSnakeCase } from '@etimo-achievements/common';
import { IBadgeAward, INewAward, IRequestContext, PaginationOptions } from '@etimo-achievements/types';
import { Database } from '..';
import { BadgeAwardModel } from '../models/badge-award-model';
import { catchErrors } from '../utils';

export class BadgeAwardRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from "badge_awards"');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  getAll(): Promise<IBadgeAward[]> {
    return catchErrors(async () => {
      return BadgeAwardModel.query().select();
    });
  }

  getMany(options: PaginationOptions): Promise<IBadgeAward[]> {
    return catchErrors(async () => {
      const query = BadgeAwardModel.query().limit(options.take).offset(options.skip);
      if (!options.orderBy.length) {
        query.orderBy('created_at', 'desc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  findById(awardId: string): Promise<IBadgeAward> {
    return catchErrors(async () => {
      return BadgeAwardModel.query().findById(awardId);
    });
  }

  findLatest(userId: string, badgeId: string): Promise<IBadgeAward | undefined> {
    return catchErrors(async () => {
      return BadgeAwardModel.query().orderBy('created_at', 'desc').findOne({
        user_id: userId,
        badge_id: badgeId,
      });
    });
  }

  create(award: INewAward): Promise<IBadgeAward> {
    return catchErrors(async () => {
      return BadgeAwardModel.query().insert(award);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return BadgeAwardModel.query().deleteById(id);
    });
  }
}
