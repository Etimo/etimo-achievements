import { uuid } from '@etimo-achievements/common';
import { IUser, JWT } from '@etimo-achievements/types';
import { getEnvVariable } from '@etimo-achievements/utils';
import jwt from 'jsonwebtoken';
import { decrypt, encrypt } from '..';

type JwtServiceOptions = {
  expirationSeconds: number;
  clientId?: string;
};

export class JwtService {
  public static create(user: IUser, scopes: string[], options?: JwtServiceOptions): JWT {
    const expirationSeconds = options?.expirationSeconds ?? +getEnvVariable('JWT_EXPIRATION_SECONDS');
    const token: JWT = {
      jti: uuid(),
      sub: options?.clientId ? options.clientId : user.id,
      act: user.id,
      name: user.name,
      email: user.email,
      iss: 'etimo-achievements',
      aud: 'etimo-achievements',
      exp: Math.round(new Date().getTime() / 1000 + expirationSeconds),
      iat: Math.round(new Date().getTime() / 1000),
      scope: scopes.join(' '),
    };

    return token;
  }

  public static lock(payload: any): string {
    return encrypt(this.sign(payload));
  }

  public static unlock(token: string): JWT {
    return this.verify(decrypt(token));
  }

  public static sign(payload: any): string {
    return jwt.sign(payload, getEnvVariable('JWT_SECRET'));
  }

  public static verify(token: string): JWT {
    const payload = jwt.verify(token, getEnvVariable('JWT_SECRET'));
    return payload as JWT;
  }
}
