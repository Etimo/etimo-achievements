export interface IAccessToken {
  id: string;
  userId: string;
  signedToken?: string;
  refreshToken: string;
  expiresAt: Date;
  disabled: boolean;
}

export type INewAccessToken = Omit<IAccessToken, 'signedToken'>;
export type IPartialAccessToken = Pick<IAccessToken, 'id'> & Partial<IAccessToken>;
