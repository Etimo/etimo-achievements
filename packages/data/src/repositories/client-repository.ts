import { IClient } from '../models';
import { ClientModel, INewClient, IPartialClient } from '../models/client-model';

export class ClientRepository {
  findById(id: string): Promise<IClient> {
    return ClientModel.query().findById(id);
  }

  create(client: INewClient): Promise<IClient> {
    return ClientModel.query().insert(client);
  }

  update(client: IPartialClient): Promise<IClient> {
    return ClientModel.query().patchAndFetchById(client.id, client);
  }

  delete(id: string): Promise<number> {
    return ClientModel.query().deleteById(id);
  }
}
