import { HighscoreDto } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class HighscoreApi {
  private api = new Api();

  public getMany(skip: number = 0, take: number = 50) {
    return this.api.get<HighscoreDto[]>(`/highscores?skip=${skip}&take=${take}`);
  }
}
