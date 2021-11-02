import { IUserAchievement } from '@etimo-achievements/data';
import { AwardsDto } from '.';

export class AwardsMapper {
  public static toAwardsDto(userAchevement: IUserAchievement): AwardsDto {
    return {
      id: userAchevement.id,
      achievementId: userAchevement.achievementId,
      userId: userAchevement.userId,
    };
  }

  public static toUserAchievement(awardsDto: AwardsDto): IUserAchievement {
    return {
      id: awardsDto.id,
      achievementId: awardsDto.achievementId,
      userId: awardsDto.userId,
    };
  }
}
