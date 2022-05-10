import { AwardDto } from '..';
import Api from './api';

const api = new Api();

export const getAward = (id: string) => {
  return api.get<AwardDto>(`/awards/${id}`);
};

export const getAwards = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/awards?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return api.get<AwardDto[]>(url);
};

export const createAward = (award: AwardDto) => {
  return api.post<{ awardId: string }>('/awards', award);
};

export const deleteAward = (id: string) => {
  return api.delete<{ awardId: string }>(`/awards/${id}`);
};
