import { useAppSelector } from '../../app/store';
import { authSelector } from '../../features/auth/auth-slice';

export type Action = 'create' | 'read' | 'update' | 'remove' | 'admin';
export type Resource = 'achievements' | 'awards' | 'highscore' | 'users' | 'profile';

function useHasScope() {
  const auth = useAppSelector(authSelector);

  return (requestedScope: string) => {
    if (auth.tokenInfo) {
      const scopes = auth.tokenInfo?.scope.split(' ') ?? [];

      for (const scope of scopes) {
        if (scope === requestedScope) {
          return true;
        }
      }
    }

    return false;
  };
}

export default useHasScope;
