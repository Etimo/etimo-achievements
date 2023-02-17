import { JwtService } from '@etimo-achievements/security';
import { IUser } from '@etimo-achievements/types';
import { IContext } from '../..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class CreateClientTokenService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async create(clientId: string, user: IUser, scopes: string[]): Promise<LoginResponse> {
    // Create a token for the user
    const token = JwtService.create(user, scopes, { expirationSeconds: 86400 * 365, clientId });

    // Store token in database
    const createTokenService = new CreateTokenService(this.context);
    const createdToken = await createTokenService.createAccessToken(token);
    const signedToken = JwtService.sign(token);
    const expiresIn = Math.round((createdToken.expiresAt.getTime() - new Date().getTime()) / 1000);

    return {
      ...createdToken,
      signedToken,
      expiresIn,
    };
  }
}
