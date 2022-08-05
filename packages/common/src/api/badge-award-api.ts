import { BadgeAwardDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getBadgeAward = (id: string) => {
  return authorizedApi.get<BadgeAwardDto>(`/badge-awards/${id}`);
};

export const getBadgeAwards = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/badge-awards?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<BadgeAwardDto[]>(url);
};

export const createBadgeAward = (award: BadgeAwardDto) => {
  return api.post<{ awardId: string }>('/badge-awards', award);
};

export const deleteBadgeAward = (id: string) => {
  return api.delete<{ awardId: string }>(`/badge-awards/${id}`);
};
