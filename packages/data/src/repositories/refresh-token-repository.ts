import { IRefreshToken } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { RefreshTokenModel } from '../models/refresh-token-model';
import { CreateData } from '../types';
import { BaseRepository } from './base-repository';

export class RefreshTokenRepository extends BaseRepository<RefreshTokenModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new RefreshTokenModel(), Database.knex, transaction);
  }

  public getExpired(): Promise<IRefreshToken[]> {
    return this.model.query().where('expires_at', '<', new Date()).orWhere('disabled', true).orWhere('used', true);
  }

  public findById(id: string): Promise<IRefreshToken> {
    return super.$findById(id);
  }

  public create(data: CreateData<RefreshTokenModel>): Promise<IRefreshToken> {
    return super.$create(data);
  }
}
