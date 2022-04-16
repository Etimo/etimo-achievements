import { AchievementDto, AwardDto, UserDto } from '@etimo-achievements/common';

export interface AwardState {
  composites: AwardComposite[];
}

export type AwardComposite = {
  award: AwardDto;
  awardedTo: UserDto;
  awardedBy: UserDto;
  achievement: AchievementDto;
};
