import { Logger, uuid } from '@etimo-achievements/common';
import { AccessTokenRepository, RefreshTokenRepository } from '@etimo-achievements/data';
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
import { ServiceOptions } from '..';
import { LoginResponse } from './types/login-response';

export class CreateTokenService {
  private accessTokenRepo: AccessTokenRepository;
  private refreshTokenRepo: RefreshTokenRepository;

  constructor(options?: ServiceOptions) {
    this.accessTokenRepo = options?.accessTokenRepository ?? new AccessTokenRepository();
    this.refreshTokenRepo = options?.refreshTokenRepository ?? new RefreshTokenRepository();
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
    const newToken: INewAccessToken = {
      id: token.jti,
      userId: token.sub,
      disabled: false,
      expiresAt: new Date(token.exp * 1000),
      scopes: token.scope.split(' '),
    };

    const accessToken = await this.accessTokenRepo.create(newToken);

    const deleted = await this.accessTokenRepo.deleteInvalid();
    if (deleted) {
      Logger.log(`Deleted ${deleted} invalid access tokens`);
    }

    Logger.log(`Stored access token for user ${newToken.userId}`);

    return accessToken;
  }

  public async createRefreshToken(token: IAccessToken, key: string): Promise<IRefreshToken> {
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

    const refreshToken = await this.refreshTokenRepo.create(newRefreshToken);

    Logger.log(`Stored refresh token (${refreshToken.id}) for user ${data.userId}`);

    return refreshToken;
  }
}
