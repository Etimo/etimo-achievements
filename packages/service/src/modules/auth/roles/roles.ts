import { Role } from '@etimo-achievements/types';

type Action = 'c' | 'r' | 'u' | 'a' | 'cru' | 'ru';
type Resource = 'achievements' | 'awards' | 'users' | 'profile' | 'highscore' | 'feature';
type UserPermissions = Partial<Record<Resource, Action>>;
type Scopes = string[];

const createRole = (permissions: UserPermissions): Scopes => {
  return Object.entries(permissions).map(([key, value]: [string, Action]) => {
    return `${value}:${key}`;
  });
};

const basePermissions: UserPermissions = {
  achievements: 'r',
  awards: 'cru',
  users: 'r',
  profile: 'ru',
  highscore: 'r',
  feature: 'r',
};

export const userRole: Scopes = createRole(basePermissions);

export const moderatorRole: Scopes = createRole({
  ...basePermissions,
  achievements: 'cru',
});

export const adminRole: Scopes = createRole({
  achievements: 'a',
  awards: 'a',
  users: 'a',
  profile: 'a',
  highscore: 'a',
  feature: 'a',
});

export const roleToScope = (key: Role) => {
  switch (key) {
    case 'user':
      return userRole;
    case 'moderator':
      return moderatorRole;
    case 'admin':
      return adminRole;
    default:
      return userRole;
  }
};
