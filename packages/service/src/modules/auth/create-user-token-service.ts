import { JwtService, randomPassword, RefreshTokenService } from '@etimo-achievements/security';
import { IUser } from '@etimo-achievements/types';
import { IContext } from '../..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class CreateUserTokenService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async create(user: IUser, scopes: string[]): Promise<LoginResponse> {
    // Create a token for the user
    const token = JwtService.create(user, scopes);

    // Store token in database
    const createTokenService = new CreateTokenService(this.context);
    const createdToken = await createTokenService.createAccessToken(token);
    const signedToken = JwtService.lock(token);
    const refreshTokenKey = randomPassword(64);
    const createdRefreshToken = await createTokenService.createRefreshToken(createdToken, refreshTokenKey);
    const refreshToken = RefreshTokenService.lock({ id: createdRefreshToken.id, key: refreshTokenKey });
    const expiresIn = Math.round((createdToken.expiresAt.getTime() - new Date().getTime()) / 1000);

    return {
      ...createdToken,
      signedToken,
      refreshToken,
      expiresIn,
      refreshTokenExpiresAt: createdRefreshToken.expiresAt,
    };
  }
}
