import { IClient, INewClient, IPartialClient } from '@etimo-achievements/types';
import Knex from 'knex';
import { Database } from '..';
import { ClientModel } from '../models/client-model';
import { catchErrors } from '../utils';
import { BaseRepository } from './base-repository';

export class ClientRepository extends BaseRepository<ClientModel> {
  constructor(transaction?: Knex.Transaction) {
    super(new ClientModel(), Database.knex, transaction);
  }

  findById(id: string): Promise<IClient | undefined> {
    return catchErrors(async () => {
      return ClientModel.query().findById(id);
    });
  }

  create(client: INewClient): Promise<IClient> {
    return catchErrors(async () => {
      return ClientModel.query().insert(client);
    });
  }

  update(client: IPartialClient): Promise<IClient> {
    return catchErrors(async () => {
      return ClientModel.query().patchAndFetchById(client.id, client);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return ClientModel.query().deleteById(id);
    });
  }

  deleteInvalid(): Promise<number> {
    return catchErrors(async () => {
      return ClientModel.query().where('expires_at', '<', new Date()).orWhere('disabled', true).delete();
    });
  }
}
