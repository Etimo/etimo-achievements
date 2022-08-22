import { IAccessToken } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { AccessTokenModel } from '../models/access-token-model';
import { catchErrors } from '../utils';
import { BaseRepository, CreateData, DeleteOptions, UpdateOptions } from './base-repository';

export class AccessTokenRepository extends BaseRepository<AccessTokenModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new AccessTokenModel(), Database.knex, transaction);
  }

  public async deleteInvalid(): Promise<number> {
    return catchErrors(async () => {
      return this.model.query().where('expires_at', '<', new Date()).orWhere('disabled', true).delete();
    });
  }

  public async findById(id: string): Promise<IAccessToken> {
    return super.$findById(id);
  }

  public async create(data: CreateData<AccessTokenModel>): Promise<IAccessToken> {
    return super.$create(data);
  }

  public async delete(options: DeleteOptions<AccessTokenModel>): Promise<number> {
    return super.$delete(options);
  }

  public async update(data: Partial<AccessTokenModel>, options?: UpdateOptions<AccessTokenModel>): Promise<number> {
    return super.$update(data, options);
  }
}
