import { AccessTokenRepository } from '@etimo-achievements/data';
import { JWT } from '@etimo-achievements/types';
import { ServiceOptions } from '..';

export class LogoutService {
  private repo: AccessTokenRepository;

  constructor(options?: ServiceOptions) {
    this.repo = options?.accessTokenRepository ?? new AccessTokenRepository();
  }

  public async logout(jwt: JWT): Promise<void> {
    const accessToken = await this.repo.findById(jwt.jti);
    await this.repo.update({ ...accessToken, disabled: true });
  }
}
