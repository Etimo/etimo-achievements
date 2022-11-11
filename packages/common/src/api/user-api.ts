import { RoleDto, uniq, UserDto } from '..';
import Api from './api';
import AuthorizedApi from './authorized-api';

const api = new Api();
const authorizedApi = new AuthorizedApi();

export const getUser = (id: string) => {
  return authorizedApi.get<UserDto>(`/users/${id}`);
};

export const getAllRoles = () => {
  return authorizedApi.get<RoleDto[]>('/users/roles');
};

export const getProfile = () => {
  return authorizedApi.get<UserDto>('/profile');
};

export const getUsers = (skip: number = 0, take: number = 50, sort?: string, order?: string) => {
  let url = `/users?skip=${skip}&take=${take}`;
  if (sort) url += `&orderBy=${sort}~${order ?? 'asc'}`;
  return authorizedApi.get<UserDto[]>(url);
};

export const listUsers = (ids: string[]) => {
  return authorizedApi.post<UserDto[]>('/users/list', uniq(ids.filter((i) => !!i)));
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
