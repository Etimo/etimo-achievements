import { PaginatedData, UserDto } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class UserApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<UserDto>(`/users/${id}`);
  }

  public getProfile() {
    return this.api.get<UserDto>('/profile');
  }

  public getMany() {
    return this.api.get<PaginatedData<UserDto>>('/users');
  }

  public list(ids: string[]) {
    return this.api.post<UserDto[]>('/users/list', ids);
  }

  public create(user: UserDto) {
    return this.api.post<{ userId: string }>('/users', user);
  }

  public update(id: string, user: UserDto) {
    return this.api.put<{ userId: string }>(`/users/${id}`, user);
  }

  public updateProfile(user: UserDto) {
    return this.api.put<{ userId: string }>('/profile', user);
  }

  public delete(id: string) {
    return this.api.delete<{ userId: string }>(`/users/${id}`);
  }
}
