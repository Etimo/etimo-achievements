export interface IRefreshTokenData {
  userId: string;
  scopes: string[];
  accessTokenId: string;
}

export interface IRefreshToken {
  id: string;
  data: string;
  disabled: boolean;
  used: boolean;
  expiresAt: Date;
}

export type INewRefreshToken = IRefreshToken;
export type IPartialRefreshToken = Pick<IRefreshToken, 'id'> & Partial<IRefreshToken>;
