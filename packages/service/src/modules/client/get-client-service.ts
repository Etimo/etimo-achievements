import { NotFoundError } from '@etimo-achievements/common';
import { IClient } from '@etimo-achievements/types';
import { IContext } from '../..';

export class GetClientService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async getManyByUserId(userId: string): Promise<IClient[]> {
    const clients = await this.repos.client.getBy({ userId }, {});
    return clients;
  }

  public async get(id: string): Promise<IClient> {
    const client = await this.repos.client.findById(id);
    if (!client) {
      throw new NotFoundError('Client not found');
    }

    return client;
  }
}
