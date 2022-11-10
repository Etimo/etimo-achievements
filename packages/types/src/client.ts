export interface IClient {
  id: string;
  clientSecret: string;
  userId: string;
}

export type INewClient = IClient;
export type IPartialClient = Pick<IClient, 'id'> & Partial<IClient>;
