import { BadRequestError, Logger, UnauthorizedError } from '@etimo-achievements/common';
import { AccessTokenRepository, RefreshTokenRepository } from '@etimo-achievements/data';
import { decryptAs } from '@etimo-achievements/security';
import { IRefreshTokenData } from '@etimo-achievements/types';
import { GetUserService, ServiceOptions } from '..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class RefreshLoginService {
  private getUserService: GetUserService;
  private createTokenService: CreateTokenService;
  private accessTokenRepo: AccessTokenRepository;
  private refreshTokenRepo: RefreshTokenRepository;

  constructor(options: ServiceOptions) {
    this.getUserService = new GetUserService(options);
    this.createTokenService = new CreateTokenService(options);
    this.accessTokenRepo = options.accessTokenRepository ?? new AccessTokenRepository();
    this.refreshTokenRepo = options.refreshTokenRepository ?? new RefreshTokenRepository();
  }

  public async refresh(refreshTokenId: string, key: string): Promise<LoginResponse> {
    const refreshToken = await this.refreshTokenRepo.findById(refreshTokenId);
    if (!refreshToken) throw new UnauthorizedError('Refresh token not found');
    if (refreshToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');
    if (refreshToken.used) throw new UnauthorizedError('Refresh token has already been used');

    const data = decryptAs<IRefreshTokenData>(refreshToken.data, key);
    const user = await this.getUserService.get(data.userId);
    if (!user) throw new BadRequestError('User not found');

    await Promise.allSettled([
      this.refreshTokenRepo.delete(refreshTokenId),
      this.accessTokenRepo.delete(data.accessTokenId),
    ]);

    const deleted = await this.refreshTokenRepo.deleteInvalid();
    if (deleted) {
      Logger.log(`Deleted ${deleted} invalid refresh tokens`);
    }

    return this.createTokenService.create(user, data.scopes);
  }
}
