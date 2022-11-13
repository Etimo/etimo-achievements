import { ClientDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getClient = (id: string) => {
  return authorizedApi.get<ClientDto>(`/clients/${id}`);
};

export const getUserClients = (userId: string) => {
  return authorizedApi.get<ClientDto[]>(`/users/${userId}/clients`);
};

export const createClient = (client: ClientDto) => {
  return api.post<{ clientId: string }>('/clients', client);
};
