import {
  ForbiddenError,
  NotFoundError,
  paginate,
  PaginatedData,
  scopesMatch,
  UnauthorizedError,
} from '@etimo-achievements/common';
import { hashPassword, randomPassword, verifyPassword } from '@etimo-achievements/security';
import { IClient, INewClient, PaginationOptions, Role } from '@etimo-achievements/types';
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
    return createClientTokenService.create(client.id, user, client.scope.split(' '));
  }

  public async create(data: INewClient) {
    const { repositories, userId } = this.context;

    const user = await repositories.user.findById(userId);

    if (!user) throw new NotFoundError('User not found.');

    const userScopes = roleToScope(user.role as Role) as string[];

    const validScopes = data.scope.split(' ').every((s) => scopesMatch(s, userScopes.join(' ')));

    if (!validScopes) throw new ForbiddenError('User lacks the required scopes');

    const { clientSecret, hash } = await this.generateSecret();

    const result = await repositories.client.create({ ...data, clientSecret: hash, userId });

    return {
      ...result,
      clientSecret,
    };
  }

  public async getMany(options: PaginationOptions): Promise<PaginatedData<IClient>> {
    const { repositories, userId } = this.context;

    const clients = await repositories.client.find({ ...options, where: { userId } });
    const count = await repositories.client.count({});

    return paginate(clients, count, options);
  }

  public async rotate(clientId: string) {
    const { userId, repositories } = this.context;

    const client = await repositories.client.findByUserId(userId, clientId);

    if (!client) throw new NotFoundError('Client not found');

    const { clientSecret, hash } = await this.generateSecret();

    await repositories.client.updateById(clientId, { clientSecret: hash });

    return { ...client, clientSecret };
  }

  public async remove(clientId: string) {
    const { userId, repositories } = this.context;

    const clients = await repositories.client.find({ where: { userId, id: clientId } });
    const isOwner = clients[0].userId === userId;

    if (!isOwner) throw new ForbiddenError('User not owner of client');

    await repositories.client.deleteById(clientId);
  }

  private async generateSecret() {
    const clientSecret = randomPassword(32);
    const hash = await hashPassword(clientSecret);

    return { hash, clientSecret };
  }
}
