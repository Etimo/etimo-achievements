import { TokenInfoDto, UserDto, UserInfoDto } from '@etimo-achievements/common';

export interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  user?: UserDto;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  ExpiresAt = 'expiresAt',
}
