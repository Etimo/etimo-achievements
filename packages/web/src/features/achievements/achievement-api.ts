import { AchievementDto, PaginatedData, uniq } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class AchievementApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<AchievementDto>(`/achievements/${id}`);
  }

  public getMany(skip: number = 0, take: number = 1000) {
    return this.api.get<PaginatedData<AchievementDto>>(`/achievements?skip=${skip}&take=${take}`);
  }

  public list(ids: string[]) {
    return this.api.post<AchievementDto[]>('/achievements/list', uniq(ids.filter((i) => !!i)));
  }

  public create(achievement: AchievementDto) {
    return this.api.post<{ achievementId: string }>('/achievements', achievement);
  }

  public update(id: string, achievement: AchievementDto) {
    return this.api.put<{ achievementId: string }>(`/achievements/${id}`, achievement);
  }

  public delete(id: string) {
    return this.api.delete<{ achievementId: string }>(`/achievements/${id}`);
  }
}
