import { useAppSelector } from '../../app/store';
import { authSelector } from '../../features/auth/auth-slice';

export type Action = 'create' | 'read' | 'update' | 'remove' | 'admin';
export type Resource =
  | 'achievements'
  | 'awards'
  | 'highscore'
  | 'users'
  | 'profile'
  | 'badges'
  | 'badge-awards'
  | 'trophy';

function useHasAccess() {
  const auth = useAppSelector(authSelector);

  return (action: Action, resource: Resource) => {
    if (auth.tokenInfo) {
      const scopes = auth.tokenInfo?.scope.split(' ') ?? [];

      for (const scope of scopes) {
        const scopeActions = scope.split(':')[0].split('');
        const scopeResource = scope.split(':')[1];

        if (scopeResource !== resource) continue;

        if (action === 'admin' && scopeActions.includes('a')) {
          return true;
        }

        if (action === 'create' && (scopeActions.includes('c') || scopeActions.includes('a'))) {
          return true;
        }

        if (action === 'read' && (scopeActions.includes('r') || scopeActions.includes('a'))) {
          return true;
        }

        if (action === 'update' && (scopeActions.includes('u') || scopeActions.includes('a'))) {
          return true;
        }

        if (action === 'remove' && (scopeActions.includes('d') || scopeActions.includes('a'))) {
          return true;
        }
      }
    }

    return false;
  };
}

export default useHasAccess;
