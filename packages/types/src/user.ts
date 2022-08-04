export interface IUser {
  id: string;
  name: string;
  email: string;
  slackHandle?: string;
  role: string;
}

export type Role = 'user' | 'moderator' | 'admin';

export type INewUser = Omit<IUser, 'id'>;
export type IPartialUser = Pick<IUser, 'id'> & Partial<IUser>;
