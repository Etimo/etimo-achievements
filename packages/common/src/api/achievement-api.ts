import { AchievementDto, uniq } from '..';
import Api from './api';

export class AchievementApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<AchievementDto>(`/achievements/${id}`);
  }

  public getMany(skip: number = 0, take: number = 50, sort?: string, order?: string) {
    let url = `/achievements?skip=${skip}&take=${take}`;
    if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
    return this.api.get<AchievementDto[]>(url);
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
