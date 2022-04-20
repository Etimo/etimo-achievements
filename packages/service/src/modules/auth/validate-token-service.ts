import { JWT } from '@etimo-achievements/types';
import { IContext } from '../..';

export class ValidateTokenService {
  constructor(private context: IContext) {}

  public async validate(jwt: JWT): Promise<boolean> {
    const { repositories } = this.context;

    const accessToken = await repositories.accessToken.findById(jwt.jti);
    return accessToken && !accessToken.disabled;
  }
}
