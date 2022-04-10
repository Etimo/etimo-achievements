import { useAppDispatch } from '../../app/store';
import { AchievementApi } from './achievement-api';
import { deleteAchievement, setAchievements, updateAchievement } from './achievement-slice';

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

  public async get(id: string) {
    const response = await this.api.get(id).wait();
    if (response.success) {
      const achievement = await response.data();
      this.dispatch(updateAchievement(achievement));
      return achievement;
    }
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteAchievement(id));
      return true;
    }
    return false;
  }
}
