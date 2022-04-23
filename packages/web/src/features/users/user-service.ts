import { UserDto } from '@etimo-achievements/common';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { UserApi } from './user-api';
import { addUser, deleteUser, profileSelector, setUsers, updateUser, updateUsers, usersSelector } from './user-slice';

export class UserService {
  private dispatch = useAppDispatch();
  private users = useAppSelector(usersSelector).users;
  private profile = useAppSelector(profileSelector);
  private api = new UserApi();

  public async load() {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const data = await response.data();
      this.dispatch(setUsers(data));
    }
  }

  public async getMany(skip: number, take: number) {
    const response = await this.api.getMany(skip, take).wait();
    if (response.success) {
      const data = await response.data();
      this.dispatch(setUsers(data));

      return { pagination: response.pagination!, data };
    }
  }

  public async getProfile() {
    if (!this.profile) {
      return this.fetchProfile();
    }
    return this.profile;
  }

  public async get(id: string) {
    const user = this.users.find((user: UserDto) => user.id === id);
    if (!user) {
      return this.fetch(id);
    }
  }

  public async fetch(id: string) {
    const response = await this.api.get(id).wait();
    if (response.success) {
      const user = await response.data();
      this.dispatch(updateUser(user));
      return user;
    }
  }

  public async fetchProfile() {
    const response = await this.api.getProfile().wait();
    if (response.success) {
      const user = await response.data();
      this.dispatch(updateUser(user));
      return user;
    }
  }

  public async list(ids: string[]) {
    const response = await this.api.list(ids).wait();
    if (response.success) {
      const users = await response.data();
      this.dispatch(updateUsers(users));
      return users;
    }
  }

  public async create(user: UserDto) {
    const response = await this.api.create(user).wait();
    if (response.success) {
      this.dispatch(addUser(user));
    }
    return response;
  }

  public async update(id: string, user: UserDto) {
    const response = await this.api.update(id, user).wait();
    if (response.success) {
      this.dispatch(updateUser(user));
    }
    return response;
  }

  public async updateProfile(user: UserDto) {
    const response = await this.api.updateProfile(user).wait();
    if (response.success) {
      this.fetchProfile();
    }
    return response;
  }

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteUser(id));
    }
    return response;
  }
}
