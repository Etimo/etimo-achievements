import { InternalServerError } from '@etimo-achievements/common';
import { IAccessToken } from '@etimo-achievements/types';
import { AccessTokenDto } from './access-token-dto';

export class AccessTokenMapper {
  public static toAccessTokenDto(token: IAccessToken): AccessTokenDto {
    if (!token.signedToken) {
      throw new InternalServerError('signedToken cannot be null when mapping to access token');
    }

    return {
      access_token: token.signedToken,
      token_type: 'bearer',
      expires_in: Math.round((token.expiresAt.getTime() - new Date().getTime()) / 1000),
      refresh_token: token.refreshToken,
    };
  }
}
