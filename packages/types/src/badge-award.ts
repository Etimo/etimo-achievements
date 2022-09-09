export interface IBadgeAward {
  id: string;
  badgeId: string;
  awardedByUserId: string;
  userId: string;
  createdAt: Date;
}

export type INewBadgeAward = Omit<IBadgeAward, 'id' | 'createdAt' | 'userId'> & { userIds: string[] };
export type IPartialBadgeAward = Pick<IBadgeAward, 'id'> & Partial<IBadgeAward>;
