export interface IUserAchievement {
  id: string;
  achievementId: string;
  userId: string;
}

export type INewUserAchievement = Omit<IUserAchievement, 'id'>;
export type IPartialUserAchievement = Pick<IUserAchievement, 'id'> & Partial<IUserAchievement>;
