import { decrypt, encrypt } from '..';
import { RefreshTokenKey } from './types/refresh-token-key';

export class RefreshTokenService {
  public static unlock(payload: string): RefreshTokenKey {
    const refreshTokenParts = decrypt(payload).split('.');

    return {
      id: refreshTokenParts[0],
      key: refreshTokenParts[1],
    };
  }

  public static lock(key: RefreshTokenKey): string {
    return encrypt(`${key.id}.${key.key}`);
  }
}
