import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export interface AuthState {
  isLoggedIn: boolean;
  isAuthenticating: boolean;
  isValidated: boolean;
  hasAccessToken: boolean;
  hasTokenInfo: boolean;
  hasUserInfo: boolean;
  expiresIn?: number;
  userId?: string;
  accessToken?: AccessTokenDto;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  LoggingIn = 'loggingIn',
  ExpiresAt = 'expiresAt',
}
