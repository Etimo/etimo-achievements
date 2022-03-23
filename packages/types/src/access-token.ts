export interface IAccessToken {
  id: string;
  userId: string;
  scopes: string[];
  expiresAt: Date;
  disabled: boolean;
}

export type INewAccessToken = IAccessToken;
export type IPartialAccessToken = Pick<IAccessToken, 'id'> & Partial<IAccessToken>;
