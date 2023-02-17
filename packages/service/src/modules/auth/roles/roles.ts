import { Role } from '@etimo-achievements/types';

type Action = ('c' | 'r' | 'u' | 'd')[];
type Resource =
  | 'achievements'
  | 'awards'
  | 'clients'
  | 'users'
  | 'profile'
  | 'highscore'
  | 'feature'
  | 'badges'
  | 'badge-awards'
  | 'seasons';
type RolePermissions = Partial<Record<Resource, Action>>;
type Scopes = string[];

const createRole = (permissions: RolePermissions): Scopes => {
  return Object.entries(permissions).map(([key, value]: [string, Action]) => {
    return `${value.join('')}:${key}`;
  });
};

const r: Action = ['r'];
const ru: Action = ['r', 'u'];
const cru: Action = ['c', 'r', 'u'];
const crud: Action = ['c', 'r', 'u', 'd'];

const basePermissions: RolePermissions = {
  achievements: r,
  awards: cru,
  clients: crud,
  users: r,
  profile: ru,
  highscore: r,
  feature: r,
  badges: r,
  'badge-awards': cru,
  seasons: r,
};

export const userRole: Scopes = createRole(basePermissions);

export const moderatorRole: Scopes = createRole({
  ...basePermissions,
  achievements: cru,
  badges: cru,
  seasons: cru,
});

export const adminRole: Scopes = createRole({
  achievements: crud,
  awards: crud,
  clients: crud,
  users: crud,
  profile: crud,
  highscore: crud,
  feature: crud,
  badges: crud,
  'badge-awards': crud,
  seasons: crud,
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
