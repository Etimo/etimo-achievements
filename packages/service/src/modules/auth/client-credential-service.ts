import { ForbiddenError, NotFoundError, scopesMatch, UnauthorizedError } from '@etimo-achievements/common';
import { hashPassword, randomPassword, verifyPassword } from '@etimo-achievements/security';
import { INewClient, Role } from '@etimo-achievements/types';
import { LoginResponse } from '.';
import { IContext } from '../..';
import { CreateClientTokenService } from './create-client-token-service';
import { roleToScope } from './roles';

export class ClientCredentialService {
  constructor(private context: IContext) {}

  public async login(clientId: string, clientSecret: string): Promise<LoginResponse> {
    const { logger } = this.context;

    const { repositories } = this.context;

    // Get the client
    const client = await repositories.client.findById(clientId);
    if (!client) throw new UnauthorizedError('invalid_client');

    const isCorrectPassword = await verifyPassword(clientSecret, client.clientSecret);
    if (!isCorrectPassword) throw new UnauthorizedError('invalid_client');

    const user = await repositories.user.findById(client.userId);
    if (!user) throw new UnauthorizedError('invalid_client');

    const createClientTokenService = new CreateClientTokenService(this.context);
    return createClientTokenService.create(user, client.scope.split(' '));
  }

  public async create(data: INewClient) {
    const { repositories, userId } = this.context;

    const user = await repositories.user.findById(userId);

    if (!user) throw new NotFoundError('User not found.');

    const userScopes = roleToScope(user.role as Role) as string[];

    const validScopes = data.scope.split(' ').every((s) => scopesMatch(s, userScopes.join(' ')));

    if (!validScopes) throw new ForbiddenError('User lacks the required scopes');

    const clientSecret = randomPassword(32);
    const hash = await hashPassword(clientSecret);

    const result = await repositories.client.create({ ...data, clientSecret: hash, userId });

    return {
      ...result,
      clientSecret,
    };
  }
}
