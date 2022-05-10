import { HighscoreDto } from '..';
import AuthorizedApi from './authorized-api';

const authorizedApi = new AuthorizedApi();

export const getManyHighscores = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/highscores?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<HighscoreDto[]>(url);
};
