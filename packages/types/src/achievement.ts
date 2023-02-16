export interface IAchievement {
  id: string;
  name: string;
  description: string;
  achievementPoints: number;
  cooldownMinutes: number;
  selfAwardable: boolean;
  globalCooldowns: boolean;
  deletedAt?: Date | null;
}

export type INewAchievement = Omit<IAchievement, 'id'>;
export type IPartialAchievement = Pick<IAchievement, 'id'> & Partial<IAchievement>;
