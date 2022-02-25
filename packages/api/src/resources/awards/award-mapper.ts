import { IAward } from '@etimo-achievements/types';
import { AwardDto } from './award-dto';

export class AwardMapper {
  public static toAwardDto(award: IAward): AwardDto {
    return {
      id: award.id,
      achievementId: award.achievementId,
      awardedByUserId: award.awardedByUserId,
      userId: award.userId,
    };
  }

  public static toAward(awardDto: AwardDto): IAward {
    return {
      id: awardDto.id,
      achievementId: awardDto.achievementId,
      awardedByUserId: awardDto.awardedByUserId,
      userId: awardDto.userId,
    };
  }
}
