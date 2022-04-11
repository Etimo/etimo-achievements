import { UserDto } from '@etimo-achievements/common';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { UserApi } from './user-api';
import { deleteUser, profileSelector, setUsers, updateUser, usersSelector } from './user-slice';

export class UserService {
  private dispatch = useAppDispatch();
  private users = useAppSelector(usersSelector).users;
  private profile = useAppSelector(profileSelector);
  private api = new UserApi();

  public async load() {
    const response = await this.api.getMany().wait();
    if (response.success) {
      const { data } = await response.data();
      this.dispatch(setUsers(data));
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

  public async delete(id: string) {
    const response = await this.api.delete(id).wait();
    if (response.success) {
      this.dispatch(deleteUser(id));
      return true;
    }
    return false;
  }
}
