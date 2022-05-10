import { AccessTokenDto, TokenInfoDto } from '@etimo-achievements/common';
import { LoginResponse } from '@etimo-achievements/service';
import { JWT } from '@etimo-achievements/types';

export class AccessTokenMapper {
  public static toAccessTokenDto(loginResponse: LoginResponse): AccessTokenDto {
    const rtExpiresIn = Math.floor((loginResponse.refreshTokenExpiresAt.getTime() - Date.now()) / 1000);

    return {
      access_token: loginResponse.signedToken,
      token_type: 'bearer',
      expires_in: loginResponse.expiresIn,
      rt_expires_in: rtExpiresIn,
      refresh_token: loginResponse.refreshToken,
      scopes: loginResponse.scopes,
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
