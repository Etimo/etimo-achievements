import { IRefreshToken } from '../models';
import { AccessTokenModel } from '../models/access-token-model';
import { INewRefreshToken, IPartialRefreshToken, RefreshTokenModel } from '../models/refresh-token-model';

export class RefreshTokenRepository {
  findById(id: string): Promise<IRefreshToken> {
    return RefreshTokenModel.query().findById(id);
  }

  async findByAccessToken(accessToken: string): Promise<IRefreshToken> {
    const token = await AccessTokenModel.query().findOne('token', accessToken);

    return RefreshTokenModel.query().findOne('clientId', token.clientId);
  }

  create(token: INewRefreshToken): Promise<IRefreshToken> {
    return RefreshTokenModel.query().insert(token);
  }

  update(token: IPartialRefreshToken): Promise<IRefreshToken> {
    return RefreshTokenModel.query().patchAndFetchById(token.id, token);
  }

  delete(id: string): Promise<number> {
    return RefreshTokenModel.query().deleteById(id);
  }
}
