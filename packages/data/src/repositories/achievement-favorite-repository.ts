import { IAchievementFavorite } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AchievementFavoriteModel } from '../models/achivement-favorites-model';
import { catchErrors } from '../utils';
import { BaseRepository, CreateData, DeleteOptions } from './base-repository';

export class AchievementFavoriteRepository extends BaseRepository<AchievementFavoriteModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AchievementFavoriteModel(), Database.knex, transaction);
  }

  public async findManyByUserId(id: string): Promise<IAchievementFavorite[]> {
    return catchErrors(async () => {
      return this.model.query().where({ user_id: id });
    });
  }

  public async create(data: CreateData<AchievementFavoriteModel>): Promise<IAchievementFavorite> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<AchievementFavoriteModel>): Promise<number> {
    return super.$delete(options);
  }
}
