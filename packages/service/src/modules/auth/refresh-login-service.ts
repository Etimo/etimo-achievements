import { BadRequestError, UnauthorizedError } from '@etimo-achievements/common';
import { decryptAs } from '@etimo-achievements/security';
import { IRefreshTokenData } from '@etimo-achievements/types';
import { GetUserService } from '..';
import { IContext } from '../..';
import { CreateUserTokenService } from './create-user-token-service';
import { LoginResponse } from './types/login-response';

export class RefreshLoginService {
  constructor(private context: IContext) {}

  public async refresh(refreshTokenId: string, key: string): Promise<LoginResponse> {
    const { repositories, logger } = this.context;

    const refreshToken = await repositories.refreshToken.findById(refreshTokenId);
    if (!refreshToken) throw new UnauthorizedError('Refresh token not found');
    if (refreshToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');
    if (refreshToken.used) throw new UnauthorizedError('Refresh token has already been used');

    const data = decryptAs<IRefreshTokenData>(refreshToken.data, key);
    const getUserService = new GetUserService(this.context);
    const user = await getUserService.get(data.userId);
    if (!user) throw new BadRequestError('User not found');

    await Promise.allSettled([
      repositories.refreshToken.delete({ where: { id: refreshTokenId } }),
      repositories.accessToken.delete({ where: { id: data.accessTokenId } }),
    ]);

    const deleted = await repositories.refreshToken.deleteInvalid();
    if (deleted) {
      logger.debug(`Deleted ${deleted} invalid refresh tokens`);
    }

    const createUserTokenService = new CreateUserTokenService(this.context);
    return createUserTokenService.create(user, data.scopes);
  }
}
