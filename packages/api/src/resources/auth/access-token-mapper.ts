import { LoginResponse } from '@etimo-achievements/service';
import { JWT } from '@etimo-achievements/types';
import { AccessTokenDto } from './access-token-dto';
import { TokenInfoDto } from './token-info-dto';

export class AccessTokenMapper {
  public static toAccessTokenDto(loginResponse: LoginResponse): AccessTokenDto {
    return {
      access_token: loginResponse.signedToken,
      token_type: 'bearer',
      expires_in: loginResponse.expiresIn,
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
