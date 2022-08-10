export interface IAchievementFavorite {
  id: string;
  userId: string;
  achievementId: string;
}

export type INewAchievementFavorite = Omit<IAchievementFavorite, 'id'>;
