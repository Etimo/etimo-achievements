import { IAccessToken } from '@etimo-achievements/types';

export type LoginResponse = IAccessToken & {
  signedToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshTokenExpiresAt?: Date;
};
