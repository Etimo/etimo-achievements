import { authLogout, authRefresh } from '@etimo-achievements/common';
import toast from 'react-hot-toast';
import { AuthStorageKeys } from './auth-types';

export const refreshToken = async () => {
  const refreshRes = await authRefresh().wait();
  if (refreshRes.success) {
    const data = await refreshRes.data();
    return data;
  } else {
    toast.error('Could not refresh token: ' + (await refreshRes.errorMessage));
  }

  await authLogout().wait();
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
