import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export type LoginState =
  | 'unknown'
  | 'logged-out'
  | 'should-login'
  | 'failed-login'
  | 'got-code'
  | 'got-accesstoken'
  | 'validated-accesstoken'
  | 'got-userinfo'
  | 'got-tokeninfo'
  | 'should-refresh-token'
  | 'logged-in'
  | 'should-logout';

export interface AuthState {
  authenticated: boolean;
  loginState: LoginState;
  expiresAt?: number;
  userId?: string;
  accessToken?: AccessTokenDto;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}

export enum AuthStorageKeys {
  LoggingIn = 'loggingIn',
  ExpiresAt = 'expiresAt',
}
