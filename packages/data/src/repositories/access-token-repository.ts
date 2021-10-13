import { IAccessToken } from '../models';
import { AccessTokenModel, INewAccessToken, IPartialAccessToken } from '../models/access-token-model';

export class AccessTokenRepository {
  findById(id: string): Promise<IAccessToken> {
    return AccessTokenModel.query().findById(id);
  }

  findByAccessToken(accessToken: string): Promise<IAccessToken> {
    return AccessTokenModel.query().findOne({ accessToken });
  }

  create(token: INewAccessToken): Promise<IAccessToken> {
    return AccessTokenModel.query().insert(token);
  }

  update(token: IPartialAccessToken): Promise<IAccessToken> {
    return AccessTokenModel.query().patchAndFetchById(token.id, token);
  }

  delete(id: string): Promise<number> {
    return AccessTokenModel.query().deleteById(id);
  }
}
