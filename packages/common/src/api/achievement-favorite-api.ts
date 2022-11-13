import { AchievementFavoriteDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const authorizedApi = new AuthorizedApi();
const api = new Api();

export const getFavorites = () => {
  return authorizedApi.get<AchievementFavoriteDto[]>('/achievements/favorites');
};

export const createFavorite = (achievementId: string) => {
  return api.post<{ achievementFavoriteId: string }>('/achievements/favorites', { achievementId });
};

export const deleteFavorite = (achievementId: string) => {
  return api.delete<{ achievementFavoriteId: string }>(`/achievements/favorites/${achievementId}`);
};
