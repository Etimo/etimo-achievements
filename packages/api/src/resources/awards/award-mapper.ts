import { AwardDto } from '@etimo-achievements/common';
import { IAward, INewAward } from '@etimo-achievements/types';

export class AwardMapper {
  public static toAwardDto(award: IAward): AwardDto {
    return {
      id: award.id,
      achievementId: award.achievementId,
      awardedByUserId: award.awardedByUserId,
      userId: award.userId,
      createdAt: award.createdAt,
    };
  }

  public static toNewAward(awardDto: AwardDto): INewAward {
    return {
      achievementId: awardDto.achievementId,
      awardedByUserId: awardDto.awardedByUserId,
      userId: awardDto.userId,
    };
  }
}
