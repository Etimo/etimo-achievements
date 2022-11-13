import { IClient } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { ClientModel } from '../models/client-model';
import { CreateData, FindOptions } from '../types';
import { BaseRepository } from './base-repository';

export class ClientRepository extends BaseRepository<ClientModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new ClientModel(), Database.knex, transaction);
  }

  public findById(id: string): Promise<IClient | undefined> {
    return super.$findById(id);
  }

  public getBy(filter: Partial<ClientModel>, options?: FindOptions<ClientModel>): Promise<IClient[]> {
    return super.$getBy(filter, options);
  }

  public create(client: CreateData<ClientModel>): Promise<IClient> {
    return super.$create(client);
  }
}
