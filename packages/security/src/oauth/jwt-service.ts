import { ConfigurationError, uuid } from '@etimo-achievements/common';
import { IUser } from '@etimo-achievements/types';
import jwt from 'jsonwebtoken';
import { AccessToken } from '.';

export class JwtService {
  public static create(user: IUser): AccessToken {
    const token: AccessToken = {
      jti: uuid(),
      sub: user.id,
      name: user.name,
      email: user.email,
      iss: 'etimo-achievements',
      aud: 'etimo-achievements',
      exp: Math.round(new Date().getTime() / 1000 + 3600),
      iat: Math.round(new Date().getTime() / 1000),
    };

    return token;
  }

  public static sign(payload: any): string {
    return jwt.sign(payload, this.getSecret());
  }

  public static verify(token: string): AccessToken {
    const unencrypted = jwt.verify(token, this.getSecret());
    return unencrypted as AccessToken;
  }

  private static getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ConfigurationError('JWT_SECRET is not set');
    }
    return secret;
  }
}
