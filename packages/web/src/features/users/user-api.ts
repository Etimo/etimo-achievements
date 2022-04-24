import { uniq, UserDto } from '@etimo-achievements/common';
import Api from '../../common/utils/api';

export class UserApi {
  private api = new Api();

  public get(id: string) {
    return this.api.get<UserDto>(`/users/${id}`);
  }

  public getProfile() {
    return this.api.get<UserDto>('/profile');
  }

  public getMany(skip: number = 0, take: number = 50, sort?: string, order?: string) {
    let url = `/users?skip=${skip}&take=${take}`;
    if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
    return this.api.get<UserDto[]>(url);
  }

  public list(ids: string[]) {
    return this.api.post<UserDto[]>('/users/list', uniq(ids.filter((i) => !!i)));
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
