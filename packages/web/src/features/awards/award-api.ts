import { AwardDto, PaginatedData } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class AwardApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<AwardDto>(`/awards/${id}`);
  }

  public getMany(skip: number = 0, take: number = 10) {
    return this.api.get<PaginatedData<AwardDto>>(`/awards?skip=${skip}&take=${take}`);
  }

  public create(award: AwardDto) {
    return this.api.post<{ awardId: string }>('/awards', award);
  }

  public delete(id: string) {
    return this.api.delete<{ awardId: string }>(`/awards/${id}`);
  }
}
