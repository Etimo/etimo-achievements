import { JWT } from '@etimo-achievements/types';
import { IContext } from '../..';

export class LogoutService {
  constructor(private context: IContext) {}

  public async logout(jwt: JWT, refreshTokenId?: string): Promise<void> {
    const { repositories, logger } = this.context;

    logger.debug(`Logging out user ${jwt.sub}`);

    const accessToken = await repositories.accessToken.findById(jwt.jti);
    if (accessToken) {
      await repositories.accessToken.update({ ...accessToken, disabled: true });
      logger.debug(`Access token disabled: ${jwt.jti}`);
    }

    if (refreshTokenId) {
      const refreshToken = await repositories.refreshToken.findById(refreshTokenId);
      if (refreshToken) {
        await repositories.refreshToken.update({ ...refreshToken, disabled: true });
        logger.debug(`Refresh token disabled: ${refreshTokenId}`);
      }
    }
  }
}
