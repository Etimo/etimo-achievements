import { IUserAchievement } from '@etimo-achievements/data';
import { AwardDto } from './award-dto';

export class AwardMapper {
  public static toAwardsDto(userAchevement: IUserAchievement): AwardDto {
    return {
      id: userAchevement.id,
      achievementId: userAchevement.achievementId,
      userId: userAchevement.userId,
    };
  }

  public static toUserAchievement(awardsDto: AwardDto): IUserAchievement {
    return {
      id: awardsDto.id,
      achievementId: awardsDto.achievementId,
      userId: awardsDto.userId,
    };
  }
}
