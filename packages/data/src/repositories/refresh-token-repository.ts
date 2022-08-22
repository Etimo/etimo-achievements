import { IRefreshToken } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { RefreshTokenModel } from '../models/refresh-token-model';
import { catchErrors } from '../utils';
import { BaseRepository, CreateData, DeleteOptions, UpdateOptions } from './base-repository';

export class RefreshTokenRepository extends BaseRepository<RefreshTokenModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new RefreshTokenModel(), Database.knex, transaction);
  }

  public async deleteInvalid(): Promise<number> {
    return catchErrors(async () => {
      return this.model
        .query(this.trx)
        .where('expires_at', '<', new Date())
        .orWhere('disabled', true)
        .orWhere('used', true)
        .delete();
    });
  }

  public async findById(id: string): Promise<IRefreshToken> {
    return super.$findById(id);
  }

  public async create(data: CreateData<RefreshTokenModel>): Promise<IRefreshToken> {
    return super.$create(data);
  }

  public async update(data: Partial<RefreshTokenModel>, options?: UpdateOptions<RefreshTokenModel>): Promise<number> {
    return super.$update(data, options);
  }

  public async delete(options: DeleteOptions<RefreshTokenModel>): Promise<number> {
    return super.$delete(options);
  }
}
