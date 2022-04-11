import { TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  userId?: string;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  ExpiresAt = 'expiresAt',
}
