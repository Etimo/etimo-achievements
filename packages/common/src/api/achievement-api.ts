import { AchievementDto, uniq } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getAchievement = (id: string) => {
  return authorizedApi.get<AchievementDto>(`/achievements/${id}`);
};

export const getAchievements = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/achievements?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<AchievementDto[]>(url);
};

export const listAchievements = (ids: string[]) => {
  return authorizedApi.post<AchievementDto[]>('/achievements/list', uniq(ids.filter((i) => !!i)));
};

export const createAchievement = (achievement: AchievementDto) => {
  return api.post<{ achievementId: string }>('/achievements', achievement);
};

export const updateAchievement = (id: string, achievement: AchievementDto) => {
  return api.put<{ achievementId: string }>(`/achievements/${id}`, achievement);
};

export const deleteAchievement = (id: string) => {
  return api.delete<{ achievementId: string }>(`/achievements/${id}`);
};
