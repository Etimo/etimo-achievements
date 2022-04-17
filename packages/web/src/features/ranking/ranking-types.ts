import { AchievementDto, UserDto } from '@etimo-achievements/common';

export type RankingState = {
  rankings: RankingComposite[];
};

export type RankingComposite = {
  user: UserDto;
  achievements: AchievementDto[];
  totalAchievements: number;
  totalPoints: number;
};
