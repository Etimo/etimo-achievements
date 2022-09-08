import { UnauthorizedError } from '@etimo-achievements/common';
import { LoginResponse } from '.';
import { IContext } from '../..';
import { CreateClientTokenService } from './create-client-token-service';

export class ClientCredentialService {
  constructor(private context: IContext) {}

  public async login(clientId: string, clientSecret: string): Promise<LoginResponse> {
    const { logger } = this.context;

    const { repositories } = this.context;

    // Get the client
    const client = await repositories.client.findById(clientId);
    if (!client) throw new UnauthorizedError('invalid_client');

    // TODO: make this secure
    if (clientSecret !== client.clientSecret) throw new UnauthorizedError('invalid_client');

    const user = await repositories.user.findById(client.userId);
    if (!user) throw new UnauthorizedError('invalid_client');

    let scopes = ['cru:achievements', 'cru:awards', 'r:users', 'ru:profile', 'r:highscore', 'r:feature'];

    // Administrator rights for certain users
    const isAdmin = user.email === 'niclas.lindstedt@etimo.se';
    if (isAdmin) {
      scopes = ['admin', 'a:achievements', 'a:awards', 'a:users', 'a:profile', 'a:highscore', 'a:feature'];
    }

    const createClientTokenService = new CreateClientTokenService(this.context);
    return createClientTokenService.create(user, scopes);
  }
}
