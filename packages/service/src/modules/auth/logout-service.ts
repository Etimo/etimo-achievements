import { Logger } from '@etimo-achievements/common';
import { JWT } from '@etimo-achievements/types';
import { IContext } from '../..';

export class LogoutService {
  constructor(private context: IContext) {}

  public async logout(jwt: JWT, refreshTokenId?: string): Promise<void> {
    const { repositories } = this.context;

    Logger.log(`Logging out user ${jwt.sub}`);

    const accessToken = await repositories.accessToken.findById(jwt.jti);
    await repositories.accessToken.update({ ...accessToken, disabled: true });

    Logger.log(`Access token disabled: ${jwt.jti}`);

    if (refreshTokenId) {
      const refreshToken = await repositories.refreshToken.findById(refreshTokenId);
      await repositories.refreshToken.update({ ...refreshToken, disabled: true });

      Logger.log(`Refresh token disabled: ${refreshTokenId}`);
    }
  }
}
