import { InternalServerError } from '@etimo-achievements/common';
import { LoginResponse } from '@etimo-achievements/service';
import { JWT } from '@etimo-achievements/types';
import { AccessTokenDto } from './access-token-dto';
import { TokenInfoDto } from './token-info-dto';

export class AccessTokenMapper {
  public static toAccessTokenDto(token: LoginResponse): AccessTokenDto {
    if (!token.signedToken) {
      throw new InternalServerError('signedToken cannot be null when mapping to access token');
    }

    return {
      access_token: token.signedToken,
      token_type: 'bearer',
      expires_in: Math.round((token.expiresAt.getTime() - new Date().getTime()) / 1000),
      refresh_token: token.refreshTokenId + '.' + token.refreshTokenKey,
      scopes: token.scopes,
    };
  }

  public static toTokenInfoDto(jwt: JWT): TokenInfoDto {
    return {
      active: true,
      scope: jwt.scope,
      username: jwt.email,
      token_type: 'bearer',
      jti: jwt.jti,
      sub: jwt.sub,
      iss: jwt.iss,
      aud: jwt.aud,
      exp: jwt.exp,
      iat: jwt.iat,
    };
  }
}
