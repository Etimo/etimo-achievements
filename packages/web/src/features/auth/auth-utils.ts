import { authIntrospect, authLogout, authRefresh, authUserInfo, authValidate } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { AuthStorageKeys } from './auth-types';

export const refreshToken = async () => {
  const refreshRes = await authRefresh().wait();
  if (refreshRes.success) {
    const data = await refreshRes.data();
    return data;
  } else {
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

export const isAuthenticated = () => {
  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  if (expiresAt) {
    const isAuthed = +expiresAt > Date.now();
    return isAuthed;
  }

  return false;
};

export const getExpiresIn = () => {
  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  return expiresAt ? +expiresAt - Date.now() - 2000 : 0;
};
