import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';

export type LoginState =
  | 'unknown'
  | 'logged-out'
  | 'failed-login'
  | 'got-accesstoken'
  | 'validated-accesstoken'
  | 'got-userinfo'
  | 'got-tokeninfo'
  | 'should-refresh-token'
  | 'logged-in';

export interface AuthState {
  loginState: LoginState;
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
