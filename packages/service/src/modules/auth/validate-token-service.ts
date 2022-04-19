import { AccessTokenRepository } from '@etimo-achievements/data';
import { JWT } from '@etimo-achievements/types';
import { ServiceOptions } from '..';

export class ValidateTokenService {
  private repo: AccessTokenRepository;

  constructor(options: ServiceOptions) {
    this.repo = options.accessTokenRepository ?? new AccessTokenRepository();
  }

  public async validate(jwt: JWT): Promise<boolean> {
    const accessToken = await this.repo.findById(jwt.jti);
    return accessToken && !accessToken.disabled;
  }
}
