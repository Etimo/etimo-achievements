import { IAccessToken, INewAccessToken, IPartialAccessToken, IRequestContext } from '@etimo-achievements/types';
import { AccessTokenModel } from '../models/access-token-model';
import { catchErrors } from '../utils';

export class AccessTokenRepository {
  constructor(private context: IRequestContext) {}

  findById(id: string): Promise<IAccessToken | undefined> {
    return catchErrors(async () => {
      return AccessTokenModel.query().findById(id);
    });
  }

  create(accessToken: INewAccessToken): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().insert(accessToken);
    });
  }

  update(accessToken: IPartialAccessToken): Promise<IAccessToken> {
    return catchErrors(async () => {
      return AccessTokenModel.query().patchAndFetchById(accessToken.id, accessToken);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return AccessTokenModel.query().deleteById(id);
    });
  }

  deleteInvalid(): Promise<number> {
    return catchErrors(async () => {
      return AccessTokenModel.query().where('expires_at', '<', new Date()).orWhere('disabled', true).delete();
    });
  }
}
