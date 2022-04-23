import { useAppDispatch } from '../../app/store';
import { AchievementApi } from './achievement-api';
import { deleteAchievement, updateAchievement, updateAchievements } from './achievement-slice';

export class AchievementService {
  private dispatch = useAppDispatch();
  private api = new AchievementApi();

  public async load() {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const data = await response.data();
      this.dispatch(updateAchievements(data));
    }
    return response;
  }

  public async getMany(skip: number, take: number) {
    const response = await this.api.getMany(skip, take).wait();
    if (response.success) {
      const data = await response.data();
      this.dispatch(updateAchievements(data));

      return { pagination: response.pagination!, data };
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

  public async list(ids: string[]) {
    const response = await this.api.list(ids).wait();
    if (response.success) {
      const achievements = await response.data();
      this.dispatch(updateAchievements(achievements));
      return achievements;
    }
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteAchievement(id));
    }
    return response;
  }
}
