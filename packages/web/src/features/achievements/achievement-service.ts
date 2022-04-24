import { AchievementDto } from '@etimo-achievements/common';
import { useAppDispatch } from '../../app/store';
import { AchievementApi } from './achievement-api';
import { addAchievement, deleteAchievement, updateAchievement, updateAchievements } from './achievement-slice';

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

  public async getMany(skip: number, take: number, sort?: string, order?: string) {
    const response = await this.api.getMany(skip, take, sort, order).wait();
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

  public async create(achievement: AchievementDto) {
    const response = await this.api.create(achievement).wait();
    if (response.success) {
      this.dispatch(addAchievement(achievement));
    }
    return response;
  }

  public async update(id: string, achievement: AchievementDto) {
    const response = await this.api.update(id, achievement).wait();
    if (response.success) {
      this.dispatch(updateAchievement(achievement));
    }
    return response;
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteAchievement(id));
    }
    return response;
  }
}
