import { IAccessToken } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AccessTokenModel } from '../models/access-token-model';
import { CreateData } from '../types';
import { BaseRepository } from './base-repository';

export class AccessTokenRepository extends BaseRepository<AccessTokenModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AccessTokenModel(), Database.knex, transaction);
  }

  public getExpired(): Promise<IAccessToken[]> {
    return this.model.query().where('expires_at', '<', new Date()).orWhere('disabled', true);
  }

  public findById(id: string): Promise<IAccessToken> {
    return super.$findById(id);
  }

  public create(data: CreateData<AccessTokenModel>): Promise<IAccessToken> {
    return super.$create(data);
  }
}
