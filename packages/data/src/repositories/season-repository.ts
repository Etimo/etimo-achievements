import { camelToSnakeCase } from '@etimo-achievements/common';
import { INewSeason, IPartialSeason, IRequestContext, ISeason, PaginationOptions } from '@etimo-achievements/types';
import { Database } from '..';
import { SeasonModel } from '../models/season-model';
import { catchErrors } from '../utils';

export class SeasonRepository {
  constructor(private context: IRequestContext) {}

  async count(): Promise<number> {
    return catchErrors(async () => {
      const result = await Database.knex.raw('select count(*) from seasons');
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  async countCurrent(): Promise<number> {
    return catchErrors(async () => {
      const timestamp = new Date().toISOString();
      const result = await Database.knex.raw(
        `select count(*) from seasons where period_end > \'${timestamp}\' and  period_start < \'${timestamp}\'`
      );
      return parseInt(result.rows[0]['count'], 10);
    });
  }

  getAll(): Promise<ISeason[]> {
    return catchErrors(async () => {
      return SeasonModel.query();
    });
  }

  getMany(options: PaginationOptions): Promise<ISeason[]> {
    return catchErrors(async () => {
      const query = SeasonModel.query().limit(options.take).offset(options.skip);
      if (!options.orderBy.length) {
        query.orderBy('period_end', 'desc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  getManyCurrent(options: PaginationOptions): Promise<ISeason[]> {
    return catchErrors(async () => {
      const timestamp = new Date().toISOString();
      const query = SeasonModel.query()
        .limit(options.take)
        .offset(options.skip)
        .where('period_end', '>', timestamp)
        .andWhere('period_start', '<', timestamp);
      if (!options.orderBy.length) {
        query.orderBy('period_end', 'desc');
      }
      for (const [key, order] of options.orderBy) {
        query.orderBy(camelToSnakeCase(key), order);
      }
      return query;
    });
  }

  getManyByIds(ids: string[]): Promise<ISeason[]> {
    return catchErrors(async () => {
      return SeasonModel.query().whereIn('id', ids);
    });
  }

  findById(id: string): Promise<ISeason | undefined> {
    return catchErrors(async () => {
      return SeasonModel.query().findById(id);
    });
  }

  create(season: INewSeason): Promise<ISeason> {
    return catchErrors(async () => {
      return SeasonModel.query().insert(season);
    });
  }

  update(season: IPartialSeason): Promise<ISeason> {
    return catchErrors(async () => {
      return SeasonModel.query().patchAndFetchById(season.id, season);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return SeasonModel.query().deleteById(id);
    });
  }
}
