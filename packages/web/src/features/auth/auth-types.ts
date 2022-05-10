import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export interface AuthState {
  authenticated: boolean;
  expiresAt?: number;
  userId?: string;
  accessToken?: AccessTokenDto;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  ExpiresAt = 'expiresAt',
}
