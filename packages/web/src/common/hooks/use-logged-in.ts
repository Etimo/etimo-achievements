import { useAppSelector } from '../../app/store';
import { authSelector } from '../../features/auth/auth-slice';
import { AuthStorageKeys } from '../../features/auth/auth-types';

function useLoggedIn() {
  const auth = useAppSelector(authSelector);

  const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
  if (expiresAt) {
    return +expiresAt > Date.now();
  }

  return auth.isAuthenticated;
}

export default useLoggedIn;
