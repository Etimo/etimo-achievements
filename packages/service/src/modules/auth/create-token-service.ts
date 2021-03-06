import { uuid } from '@etimo-achievements/common';
import { encrypt, JwtService, randomPassword, RefreshTokenService } from '@etimo-achievements/security';
import {
  IAccessToken,
  INewAccessToken,
  INewRefreshToken,
  IRefreshToken,
  IRefreshTokenData,
  IUser,
  JWT,
} from '@etimo-achievements/types';
import spacetime from 'spacetime';
import { IContext } from '../..';
import { LoginResponse } from './types/login-response';

export class CreateTokenService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async create(user: IUser, scopes: string[]): Promise<LoginResponse> {
    // Create a token for the user
    const token = JwtService.create(user, scopes);

    // Store token in database
    const createdToken = await this.createAccessToken(token);
    const signedToken = JwtService.lock(token);
    const refreshTokenKey = randomPassword(64);
    const createdRefreshToken = await this.createRefreshToken(createdToken, refreshTokenKey);
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

  public async createAccessToken(token: JWT): Promise<IAccessToken> {
    const { logger } = this.context;

    const newToken: INewAccessToken = {
      id: token.jti,
      userId: token.sub,
      disabled: false,
      expiresAt: new Date(token.exp * 1000),
      scopes: token.scope.split(' '),
    };

    const accessToken = await this.repos.accessToken.create(newToken);

    const deleted = await this.repos.accessToken.deleteInvalid();
    if (deleted) {
      logger.debug(`Deleted ${deleted} invalid access tokens`);
    }

    logger.debug(`Stored access token for user ${newToken.userId}`);

    return accessToken;
  }

  public async createRefreshToken(token: IAccessToken, key: string): Promise<IRefreshToken> {
    const { logger } = this.context;

    const refreshTokenId = uuid();
    const data: IRefreshTokenData = {
      userId: token.userId,
      scopes: token.scopes,
      accessTokenId: token.id,
    };
    const encryptedData = encrypt(data, key);

    const newRefreshToken: INewRefreshToken = {
      id: refreshTokenId,
      data: encryptedData,
      disabled: false,
      used: false,
      expiresAt: spacetime().add(30, 'day').toNativeDate(),
    };

    const refreshToken = await this.repos.refreshToken.create(newRefreshToken);

    logger.debug(`Stored refresh token (${refreshToken.id}) for user ${data.userId}`);

    return refreshToken;
  }
}
