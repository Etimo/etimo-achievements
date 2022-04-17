import { uniq } from '@etimo-achievements/common';
import { useAppDispatch } from '../../app/store';
import { UserService } from '../users/user-service';
import { HighscoreApi } from './highscore-api';
import { setHighscore } from './highscore-slice';
import { HighscoreComposite } from './highscore-types';

export class HighscoreService {
  private dispatch = useAppDispatch();
  private api = new HighscoreApi();
  private userService = new UserService();

  public async load(): Promise<HighscoreComposite[]> {
    const response = await this.api.getMany(0, 10000).wait();
    if (response.success) {
      const highscores = (await response.data()).data;

      const userIds = uniq(highscores.map((a) => a.userId));
      const users = await this.userService.list(userIds);

      const composites: HighscoreComposite[] = [];
      for (const highscore of highscores) {
        const user = users?.find((u) => u.id === highscore.userId);
        if (user) {
          composites.push({
            user,
            achievements: highscore.achievements,
            points: highscore.points,
          });
        }
      }

      this.dispatch(setHighscore(composites));
    }
    return [];
  }
}
