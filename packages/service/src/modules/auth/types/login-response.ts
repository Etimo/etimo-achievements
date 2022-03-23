import { IAccessToken } from '@etimo-achievements/types';

export type LoginResponse = IAccessToken & {
  refreshTokenKey: string;
  refreshTokenId: string;
  signedToken: string;
};
