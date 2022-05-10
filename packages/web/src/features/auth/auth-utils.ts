import {
  authCallback,
  authIntrospect,
  authLogout,
  authRefresh,
  authUserInfo,
  authValidate,
  toBase64,
} from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { AuthStorageKeys } from './auth-types';

export const login = async (currentUrl?: string) => {
  const redirectUrl = currentUrl ?? window.location.pathname + window.location.search;
  window.location.href = process.env.API_URL + '/auth/login/google?state=' + toBase64(JSON.stringify({ redirectUrl }));
};

export const loginCallback = async (code: string) => {
  const response = await authCallback('google', code).wait();
  if (response.success) {
    const token = await response.data();
    localStorage.setItem(AuthStorageKeys.ExpiresAt, (Date.now() + token.expires_in * 1000).toString());
    return token;
  } else {
    localStorage.removeItem(AuthStorageKeys.ExpiresAt);
    toast.error('Could not get token: ' + (await response.errorMessage));
  }
};

export const refreshToken = async () => {
  const refreshRes = await authRefresh().wait();
  if (refreshRes.success) {
    const data = await refreshRes.data();
    return data;
  } else {
    toast.error('Could not refresh token: ' + (await refreshRes.errorMessage));
    await logout();
  }
};

export const validateToken = async () => {
  const response = await authValidate().wait();
  if (response.success) {
    const data = await response.data();
    return data.expires_in > 0;
  } else {
    toast.error('Could not validate token: ' + (await response.errorMessage));
  }
};

export const getTokenInfo = async () => {
  const response = await authIntrospect().wait();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get token info: ' + (await response.errorMessage));
  }
};

export const getUserInfo = async () => {
  const response = await authUserInfo().wait();
  if (response.success) {
    return response.data();
  } else {
    toast.error('Could not get user info: ' + (await response.errorMessage));
  }
};

export const logout = async () => {
  const response = await authLogout().wait();
  if (!response.success) {
    toast.error('Could not logout: ' + (await response.errorMessage));
  }
  localStorage.removeItem(AuthStorageKeys.ExpiresAt);
};

export const isLoggedIn = () => {
  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  if (expiresAt) {
    return +expiresAt > Date.now();
  }

  return false;
};
