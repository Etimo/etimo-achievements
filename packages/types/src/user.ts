export interface IUser {
  id: string;
  username: string;
  password: string;
  email: string;
  slackHandle: string;
}

export type INewUser = Omit<IUser, 'id'>;
export type IPartialUser = Pick<IUser, 'id'> & Partial<IUser>;
