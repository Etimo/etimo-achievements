import { uuid } from '@etimo-achievements/common';
import { encrypt } from '@etimo-achievements/security';
import {
  IAccessToken,
  INewAccessToken,
  INewRefreshToken,
  IRefreshToken,
  IRefreshTokenData,
  JWT,
} from '@etimo-achievements/types';
import spacetime from 'spacetime';
import { IContext } from '../..';

export class CreateTokenService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
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
