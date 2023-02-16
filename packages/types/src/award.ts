export interface IAward {
  id: string;
  achievementId: string;
  awardedByUserId: string;
  userId: string;
  messageId?: string | null;
  createdAt: Date;
}

export type INewAward = Omit<IAward, 'id' | 'createdAt' | 'userId'> & { userIds: string[] };
export type IPartialAward = Pick<IAward, 'id'> & Partial<IAward>;
