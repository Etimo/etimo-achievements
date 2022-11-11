export interface IUser {
  id: string;
  name: string;
  email: string;
  slackHandle?: string;
  role: string;
  image: string;
}

export type Role = 'user' | 'moderator' | 'admin';
export type RoleItem = {
  key: Role;
  name: string;
  description: string;
};
export const ROLES: Record<Role, RoleItem> = {
  user: {
    key: 'user',
    name: 'User',
    description: 'Base permissions',
  },
  moderator: {
    key: 'moderator',
    name: 'Moderator',
    description: 'Can create and update achievements and badges',
  },
  admin: {
    key: 'admin',
    name: 'Admin',
    description: 'All permissions',
  },
};

export type INewUser = Omit<IUser, 'id'>;
export type IPartialUser = Pick<IUser, 'id'> & Partial<IUser>;
