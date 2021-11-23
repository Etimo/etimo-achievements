export interface IAchievement {
  id: string;
  achievement: string;
  description: string;
}

export type INewAchievement = Omit<IAchievement, 'id'>;
export type IPartialAchievement = Pick<IAchievement, 'id'> & Partial<IAchievement>;
