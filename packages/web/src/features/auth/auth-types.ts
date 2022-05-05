import { TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isValidated: boolean;
  hasTokenInfo: boolean;
  expiresIn?: number;
  userId?: string;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  LoggingIn = 'loggingIn',
  ExpiresAt = 'expiresAt',
}
