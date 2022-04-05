import { AchievementApi } from '../../api/achievement-api';
import { useAppDispatch } from '../../app/store';
import { setAchievements } from './achievement-slice';

export class AchievementService {
  private dispatch = useAppDispatch();
  private api = new AchievementApi();

  public async load() {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const { data } = await response.data();
      this.dispatch(setAchievements(data));
    }
  }
}
