import { AccessTokenRepository } from '@etimo-achievements/data';
import { AccessToken, hashPassword, JwtService, randomPassword } from '@etimo-achievements/security';
import { IAccessToken, INewAccessToken } from '@etimo-achievements/types';
import { ServiceOptions } from '..';

export class AccessTokenService {
  private repo: AccessTokenRepository;

  constructor(options?: ServiceOptions) {
    this.repo = options?.accessTokenRepository ?? new AccessTokenRepository();
  }

  public async create(token: AccessToken): Promise<IAccessToken> {
    const refreshToken = randomPassword(64);

    const newToken: INewAccessToken = {
      id: token.jti,
      userId: token.sub,
      refreshToken: await hashPassword(refreshToken),
      disabled: false,
      expiresAt: new Date(token.exp * 1000),
    };

    const accessToken = await this.repo.create(newToken);
    const signedToken = JwtService.sign(token);

    return { ...accessToken, signedToken, refreshToken };
  }
}
