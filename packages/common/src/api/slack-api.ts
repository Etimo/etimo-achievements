import Api from './api';

const api = new Api();

export const syncSlack = () => {
  return api.post<void>('/slack/sync-users', {});
};
