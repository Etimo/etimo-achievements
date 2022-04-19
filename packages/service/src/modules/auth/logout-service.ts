import { Logger } from '@etimo-achievements/common';
import { AccessTokenRepository, RefreshTokenRepository } from '@etimo-achievements/data';
import { JWT } from '@etimo-achievements/types';
import { ServiceOptions } from '..';

export class LogoutService {
  private accessTokenRepo: AccessTokenRepository;
  private refreshTokenRepo: RefreshTokenRepository;

  constructor(options: ServiceOptions) {
    this.accessTokenRepo = options.accessTokenRepository ?? new AccessTokenRepository();
    this.refreshTokenRepo = options.refreshTokenRepository ?? new RefreshTokenRepository();
  }

  public async logout(jwt: JWT, refreshTokenId?: string): Promise<void> {
    Logger.log(`Logging out user ${jwt.sub}`);

    const accessToken = await this.accessTokenRepo.findById(jwt.jti);
    await this.accessTokenRepo.update({ ...accessToken, disabled: true });

    Logger.log(`Access token disabled: ${jwt.jti}`);

    if (refreshTokenId) {
      const refreshToken = await this.refreshTokenRepo.findById(refreshTokenId);
      await this.refreshTokenRepo.update({ ...refreshToken, disabled: true });

      Logger.log(`Refresh token disabled: ${refreshTokenId}`);
    }
  }
}
