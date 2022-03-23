import { INewRefreshToken, IPartialRefreshToken, IRefreshToken } from '@etimo-achievements/types';
import { RefreshTokenModel } from '../models/refresh-token-model';
import { catchErrors } from '../utils';

export class RefreshTokenRepository {
  findById(id: string): Promise<IRefreshToken> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().findById(id);
    });
  }

  findByRefreshToken(refreshToken: string): Promise<IRefreshToken> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().findOne({ refreshToken });
    });
  }

  create(refreshToken: INewRefreshToken): Promise<IRefreshToken> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().insert(refreshToken);
    });
  }

  update(refreshToken: IPartialRefreshToken): Promise<IRefreshToken> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().patchAndFetchById(refreshToken.id, refreshToken);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().deleteById(id);
    });
  }
}
