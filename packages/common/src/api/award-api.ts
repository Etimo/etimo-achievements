import { AwardDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getAward = (id: string) => {
  return authorizedApi.get<AwardDto>(`/awards/${id}`);
};

export const getAwards = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/awards?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<AwardDto[]>(url);
};

export const createAward = (award: AwardDto) => {
  return api.post<{ awardId: string }>('/awards', award);
};

export const deleteAward = (id: string) => {
  return api.delete<{ awardId: string }>(`/awards/${id}`);
};
