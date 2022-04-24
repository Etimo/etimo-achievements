import { HighscoreDto } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class HighscoreApi {
  private api = new Api();

  public getMany(skip: number = 0, take: number = 50, sort?: string, order?: string) {
    let url = `/highscores?skip=${skip}&take=${take}`;
    if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
    return this.api.get<HighscoreDto[]>(url);
  }
}
