import { uniq, UserDto } from '..';
import Api from './api';

const api = new Api();

export const getUser = (id: string) => {
  return api.get<UserDto>(`/users/${id}`);
};

export const getProfile = () => {
  return api.get<UserDto>('/profile');
};

export const getUsers = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/users?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return api.get<UserDto[]>(url);
};

export const listUsers = (ids: string[]) => {
  return api.post<UserDto[]>('/users/list', uniq(ids.filter((i) => !!i)));
};

export const createUser = (user: UserDto) => {
  return api.post<{ userId: string }>('/users', user);
};

export const updateUser = (id: string, user: UserDto) => {
  return api.put<{ userId: string }>(`/users/${id}`, user);
};

export const updateProfile = (user: UserDto) => {
  return api.put<{ userId: string }>('/profile', user);
};

export const deleteUser = (id: string) => {
  return api.delete<{ userId: string }>(`/users/${id}`);
};
