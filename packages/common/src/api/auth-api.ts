import { AccessTokenDto, TokenInfoDto, TokenValidationDto, UserInfoDto } from '..';
import Api from './api';

const api = new Api();

export const authLogout = () => {
  return api.get('/auth/logout');
};

export const authCallback = (provider: string, code: string) => {
  return api.get(`/auth/callback/${provider}?code=${code}`);
};

export const authValidate = () => {
  return api.get<TokenValidationDto>('/auth/validate');
};

export const authRefresh = () => {
  return api.get<AccessTokenDto>('/auth/refresh');
};

export const authUserInfo = () => {
  return api.get<UserInfoDto>('/auth/userinfo');
};

export const authIntrospect = () => {
  return api.get<TokenInfoDto>('/auth/introspect');
};
