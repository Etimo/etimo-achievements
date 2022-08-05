import { camelToSnakeCase } from '@etimo-achievements/common';
import { IBadge, INewBadge, IPartialBadge, IRequestContext, PaginationOptions } from '@etimo-achievements/types';
import { Database } from '..';
import { BadgeModel } from '../models/badge-model';
import { catchErrors } from '../utils';

export class BadgeRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from badges');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  getAll(): Promise<IBadge[]> {
    return catchErrors(async () => {
      return BadgeModel.query();
    });
  }

  getMany(options: PaginationOptions): Promise<IBadge[]> {
    return catchErrors(async () => {
      const query = BadgeModel.query().limit(options.take).offset(options.skip);
      if (!options.orderBy.length) {
        query.orderBy('name', 'asc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  getManyByIds(ids: string[]): Promise<IBadge[]> {
    return catchErrors(async () => {
      return BadgeModel.query().whereIn('id', ids);
    });
  }

  findById(id: string): Promise<IBadge | undefined> {
    return catchErrors(async () => {
      return BadgeModel.query().findById(id);
    });
  }

  create(badge: INewBadge): Promise<IBadge> {
    return catchErrors(async () => {
      return BadgeModel.query().insert(badge);
    });
  }

  update(badge: IPartialBadge): Promise<IBadge> {
    return catchErrors(async () => {
      return BadgeModel.query().patchAndFetchById(badge.id, badge);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return BadgeModel.query().deleteById(id);
    });
  }
}
