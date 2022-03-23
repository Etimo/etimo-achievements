import { BadRequestError, UnauthorizedError } from '@etimo-achievements/common';
import { RefreshTokenRepository } from '@etimo-achievements/data';
import { decryptAs } from '@etimo-achievements/security';
import { IRefreshTokenData, IRefreshTokenKey } from '@etimo-achievements/types';
import { GetUserService, ServiceOptions } from '..';
import { CreateTokenService } from './create-token-service';
import { LoginResponse } from './types/login-response';

export class RefreshLoginService {
  private getUserService: GetUserService;
  private createTokenService: CreateTokenService;
  private refreshTokenRepo: RefreshTokenRepository;

  constructor(options?: ServiceOptions) {
    this.getUserService = new GetUserService(options);
    this.createTokenService = new CreateTokenService(options);
    this.refreshTokenRepo = options?.refreshTokenRepository ?? new RefreshTokenRepository();
  }

  public async refresh(key: IRefreshTokenKey): Promise<LoginResponse> {
    const refreshToken = await this.refreshTokenRepo.findById(key.id);
    if (!refreshToken) throw new UnauthorizedError('Refresh token not found');
    if (refreshToken.expiresAt < new Date()) throw new UnauthorizedError('Refresh token has expired');
    if (refreshToken.used) throw new UnauthorizedError('Refresh token has already been used');

    const data = decryptAs<IRefreshTokenData>(refreshToken.data, key.key);
    const user = await this.getUserService.get(data.userId);
    if (!user) throw new BadRequestError('User not found');

    refreshToken.used = true;
    await this.refreshTokenRepo.update(refreshToken);

    return this.createTokenService.create(user, data.scopes);
  }
}
