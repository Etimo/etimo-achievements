import { AccessTokenDto, TokenInfoDto } from '@etimo-achievements/common';
import { LoginResponse } from '@etimo-achievements/service';
import { JWT } from '@etimo-achievements/types';

export class AccessTokenMapper {
  public static toAccessTokenDto(loginResponse: LoginResponse): AccessTokenDto {
    return {
      access_token: loginResponse.signedToken,
      token_type: 'bearer',
      expires_in: loginResponse.expiresIn,
      rt_expires_in: loginResponse.refreshTokenExpiresAt
        ? Math.floor((loginResponse.refreshTokenExpiresAt.getTime() - Date.now()) / 1000)
        : undefined,
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
      act: jwt.act,
      iss: jwt.iss,
      aud: jwt.aud,
      exp: jwt.exp,
      iat: jwt.iat,
    };
  }
}
