import { AchievementApi } from '../../api/achievement-api';
import { useAppDispatch } from '../../app/store';

export class AchievementService {
  private;

  public async getMany() {
    new AchievementApi()
      .getMany()
      .wait()
      .then((response) => {
        response.data().then((data) => {
          setAchievements(data.data);
        });
      });
  }
}
