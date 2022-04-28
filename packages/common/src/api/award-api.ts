import { AwardDto } from '..';
import Api from './api';

export class AwardApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<AwardDto>(`/awards/${id}`);
  }

  public getMany(skip: number = 0, take: number = 50, sort?: string, order?: string) {
    let url = `/awards?skip=${skip}&take=${take}`;
    if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
    return this.api.get<AwardDto[]>(url);
  }

  public create(award: AwardDto) {
    return this.api.post<{ awardId: string }>('/awards', award);
  }

  public delete(id: string) {
    return this.api.delete<{ awardId: string }>(`/awards/${id}`);
  }
}
