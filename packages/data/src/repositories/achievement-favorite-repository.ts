import { IAchievementFavorite } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AchievementFavoriteModel } from '../models/achivement-favorites-model';
import { CreateData } from '../types';
import { catchErrors } from '../utils';
import { BaseRepository } from './base-repository';

export class AchievementFavoriteRepository extends BaseRepository<AchievementFavoriteModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AchievementFavoriteModel(), Database.knex, transaction);
  }

  public findManyByUserId(id: string): Promise<IAchievementFavorite[]> {
    return catchErrors(() => {
      return this.model.query().where({ user_id: id });
    });
  }

  public create(data: CreateData<AchievementFavoriteModel>): Promise<IAchievementFavorite> {
    return super.$create(data);
  }
}
