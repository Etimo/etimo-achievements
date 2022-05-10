import AuthorizedApi from './authorized-api';

const authorizedApi = new AuthorizedApi();

export const getFeature = (featureName: string) => {
  return authorizedApi.get<boolean>(`/feature/${featureName}`);
};
