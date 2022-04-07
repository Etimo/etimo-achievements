import { PaginationType } from '@etimo-achievements/common';
import { AchievementDto } from '../../common/dtos/achievement-dto';
import Api from '../../common/utils/api';

export class AchievementApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<AchievementDto>(`/achievements/${id}`);
  }

  public getMany() {
    return this.api.get<PaginationType<AchievementDto>>('/achievements');
  }

  public create(achievement: AchievementDto) {
    return this.api.post<{ achievementId: string }>('/achievements', achievement);
  }

  public delete(id: string) {
    return this.api.delete<{ achievementId: string }>(`/achievements/${id}`);
  }
}
