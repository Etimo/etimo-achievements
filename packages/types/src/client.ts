export interface IClient {
  id: string;
  name: string;
  description: string;
  userId: string;
  scope: string;
  clientSecret: string;
}

export type INewClient = Omit<IClient, 'id' | 'clientSecret' | 'userId'>;
export type IPartialClient = Pick<IClient, 'id'> & Partial<IClient>;
