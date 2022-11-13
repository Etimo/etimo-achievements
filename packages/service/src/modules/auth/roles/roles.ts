import { Role } from '@etimo-achievements/types';

type Action = ('c' | 'r' | 'u' | 'd')[];
type Resource =
  | 'achievements'
  | 'awards'
  | 'badge-awards'
  | 'badges'
  | 'clients'
  | 'feature'
  | 'highscore'
  | 'profile'
  | 'users';
type RolePermissions = Partial<Record<Resource, Action>>;
type Scopes = string[];

const createRole = (permissions: RolePermissions): Scopes => {
  return Object.entries(permissions).map(([key, value]: [string, Action]) => {
    return `${value.join('')}:${key}`;
  });
};

const basePermissions: RolePermissions = {
  achievements: ['r'],
  awards: ['c', 'r', 'u'],
  users: ['r'],
  profile: ['r', 'u'],
  highscore: ['r'],
  feature: ['r'],
  badges: ['r'],
  'badge-awards': ['c', 'r', 'u'],
};

export const userRole: Scopes = createRole(basePermissions);

export const moderatorRole: Scopes = createRole({
  ...basePermissions,
  achievements: ['c', 'r', 'u'],
  badges: ['c', 'r', 'u'],
});

export const adminRole: Scopes = createRole({
  achievements: ['c', 'r', 'u', 'd'],
  awards: ['c', 'r', 'u', 'd'],
  users: ['c', 'r', 'u', 'd'],
  profile: ['c', 'r', 'u', 'd'],
  highscore: ['c', 'r', 'u', 'd'],
  feature: ['c', 'r', 'u', 'd'],
  badges: ['c', 'r', 'u', 'd'],
  clients: ['c', 'r', 'u', 'd'],
  'badge-awards': ['c', 'r', 'u', 'd'],
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
