import { useAppSelector } from '../../app/store';
import { authSelector } from './auth-slice';

export function isLoggedIn() {
  const auth = useAppSelector(authSelector);
  return auth.isAuthenticated;
}
