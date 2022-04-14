export interface IAward {
  id: string;
  achievementId: string;
  awardedByUserId: string;
  userId: string;
  createdAt?: Date;
}

export type INewAward = Omit<IAward, 'id'>;
export type IPartialAward = Pick<IAward, 'id'> & Partial<IAward>;
