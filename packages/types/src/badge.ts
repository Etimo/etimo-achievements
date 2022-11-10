export interface IBadge {
  id: string;
  name: string;
  description: string;
}

export type INewBadge = Omit<IBadge, 'id'>;
export type IPartialBadge = Pick<IBadge, 'id'> & Partial<IBadge>;
