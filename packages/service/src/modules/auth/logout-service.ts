import { Logger } from '@etimo-achievements/common';
import { JWT } from '@etimo-achievements/types';
import { IContext } from '../..';

export class LogoutService {
  private repos: IContext['repositories'];

  constructor(private context: IContext) {
    this.repos = context.repositories;
  }

  public async logout(jwt: JWT, refreshTokenId?: string): Promise<void> {
    Logger.log(`Logging out user ${jwt.sub}`);

    const accessToken = await this.repos.accessToken.findById(jwt.jti);
    await this.repos.accessToken.update({ ...accessToken, disabled: true });

    Logger.log(`Access token disabled: ${jwt.jti}`);

    if (refreshTokenId) {
      const refreshToken = await this.repos.refreshToken.findById(refreshTokenId);
      await this.repos.refreshToken.update({ ...refreshToken, disabled: true });

      Logger.log(`Refresh token disabled: ${refreshTokenId}`);
    }
  }
}
