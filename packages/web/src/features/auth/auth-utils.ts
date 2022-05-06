import {
  authCallback,
  authIntrospect,
  authLogout,
  authRefresh,
  authUserInfo,
  authValidate,
} from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { LocalStorage } from '../../common/enums/local-storage';
import { AuthStorageKeys } from './auth-types';

export const loginCallback = async (code: string) => {
  const response = await authCallback('google', code).wait();
  localStorage.removeItem(AuthStorageKeys.LoggingIn);
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
    localStorage.removeItem(AuthStorageKeys.ExpiresAt);
    toast.error('Could not refresh token: ' + (await refreshRes.errorMessage));
    await authLogout().wait();
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

export const storeLoggingIn = () => {
  localStorage.setItem(AuthStorageKeys.LoggingIn, Date.now().toString());
};

export const isLoggingIn = () => {
  const loggingIn = localStorage.getItem(AuthStorageKeys.LoggingIn);
  if (loggingIn) {
    return +loggingIn > Date.now() - 60 * 1000;
  }

  return false;
};

export const isLoggedIn = () => {
  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  if (expiresAt) {
    return +expiresAt > Date.now();
  }

  return false;
};

export const getLoginExpiresIn = () => {
  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  return expiresAt ? +expiresAt - Date.now() - 2000 : 0;
};

export const getRedirectUrl = () => {
  return localStorage.getItem(LocalStorage.RedirectUrl);
};

export const storeRedirectUrl = (url?: string) => {
  if (!url) {
    localStorage.removeItem(LocalStorage.RedirectUrl);
  } else {
    localStorage.setItem(LocalStorage.RedirectUrl, url);
  }
};
