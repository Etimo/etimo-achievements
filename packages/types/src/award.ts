export interface IAward {
  id: string;
  achievementId: string;
  userId: string;
}

export type INewAward = Omit<IAward, 'id'>;
export type IPartialAward = Pick<IAward, 'id'> & Partial<IAward>;
