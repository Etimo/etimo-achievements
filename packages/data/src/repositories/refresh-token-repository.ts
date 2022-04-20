import { INewRefreshToken, IPartialRefreshToken, IRefreshToken, IRequestContext } from '@etimo-achievements/types';
import { RefreshTokenModel } from '../models/refresh-token-model';
import { catchErrors } from '../utils';

export class RefreshTokenRepository {
  constructor(private context: IRequestContext) {}

  findById(id: string): Promise<IRefreshToken | undefined> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().findById(id);
    });
  }

  create(refreshToken: INewRefreshToken): Promise<IRefreshToken> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().insert(refreshToken);
    });
  }

  update(refreshToken: IPartialRefreshToken): Promise<number> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().findById(refreshToken.id).patch(refreshToken);
    });
  }

  delete(id: string): Promise<number> {
    return catchErrors(async () => {
      return RefreshTokenModel.query().deleteById(id);
    });
  }

  deleteInvalid(): Promise<number> {
    return catchErrors(async () => {
      return RefreshTokenModel.query()
        .where('expires_at', '<', new Date())
        .orWhere('disabled', true)
        .orWhere('used', true)
        .delete();
    });
  }
}
