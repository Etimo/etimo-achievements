import { HighscoreDto } from '..';
import Api from './api';

export class HighscoreApi {
  private api = new Api();

  public getMany(skip: number = 0, take: number = 50, sort?: string, order?: string) {
    let url = `/highscores?skip=${skip}&take=${take}`;
    if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
    return this.api.get<HighscoreDto[]>(url);
  }
}
