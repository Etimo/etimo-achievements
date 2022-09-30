import { BadgeDto, uniq } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getBadge = (id: string) => {
  return authorizedApi.get<BadgeDto>(`/badges/${id}`);
};

export const getBadges = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/badges?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<BadgeDto[]>(url);
};

export const listBadges = (ids: string[]) => {
  return authorizedApi.post<BadgeDto[]>('/badges/list', uniq(ids.filter((i) => !!i)));
};

export const createBadge = (badge: BadgeDto) => {
  return api.post<{ badgeId: string }>('/badges', badge);
};

export const updateBadge = (id: string, badge: BadgeDto) => {
  return api.put<{ badgeId: string }>(`/badges/${id}`, badge);
};

export const deleteBadge = (id: string) => {
  return api.delete<{ badgeId: string }>(`/badges/${id}`);
};
