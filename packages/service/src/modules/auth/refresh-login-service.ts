import { BadRequestError, Logger, UnauthorizedError } from '@etimo-achievements/common';
import { decryptAs } from '@etimo-achievements/security';
import { IRefreshTokenData } from '@etimo-achievements/types';
import { GetUserService } from '..';
import { IContext } from '../..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class RefreshLoginService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async refresh(refreshTokenId: string, key: string): Promise<LoginResponse> {
    const refreshToken = await this.repos.refreshToken.findById(refreshTokenId);
    if (!refreshToken) throw new UnauthorizedError('Refresh token not found');
    if (refreshToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');
    if (refreshToken.used) throw new UnauthorizedError('Refresh token has already been used');

    const data = decryptAs<IRefreshTokenData>(refreshToken.data, key);
    const getUserService = new GetUserService(this.context);
    const user = await getUserService.get(data.userId);
    if (!user) throw new BadRequestError('User not found');

    await Promise.allSettled([
      this.repos.refreshToken.delete(refreshTokenId),
      this.repos.accessToken.delete(data.accessTokenId),
    ]);

    const deleted = await this.repos.refreshToken.deleteInvalid();
    if (deleted) {
      Logger.log(`Deleted ${deleted} invalid refresh tokens`);
    }

    const createTokenService = new CreateTokenService(this.context);
    return createTokenService.create(user, data.scopes);
  }
}
