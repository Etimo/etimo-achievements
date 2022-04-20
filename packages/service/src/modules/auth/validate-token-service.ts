import { JWT } from '@etimo-achievements/types';
import { IContext } from '../..';

export class ValidateTokenService {
  private repos: IContext['repositories'];

  constructor(context: IContext) {
    this.repos = context.repositories;
  }

  public async validate(jwt: JWT): Promise<boolean> {
    const accessToken = await this.repos.accessToken.findById(jwt.jti);
    return accessToken && !accessToken.disabled;
  }
}
