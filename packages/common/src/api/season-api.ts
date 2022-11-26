import { SeasonDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const createSeason = (season: SeasonDto) => {
  return api.post<{ seasonId: string }>('/seasons', season);
};

export const getSeasons = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/seasons?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<SeasonDto[]>(url);
};
