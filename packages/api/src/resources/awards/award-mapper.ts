import { AwardDto, NewAwardDto } from '@etimo-achievements/common';
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

  public static toAward(dto: AwardDto): IAward {
    return {
      id: dto.id,
      achievementId: dto.achievementId,
      awardedByUserId: dto.awardedByUserId,
      userId: dto.userId,
      createdAt: dto.createdAt ?? new Date(),
    };
  }

  public static toNewAward(awardDto: NewAwardDto): INewAward {
    return {
      achievementId: awardDto.achievementId,
      awardedByUserId: awardDto.awardedByUserId,
      userIds: awardDto.userIds,
    };
  }

  public static isProperty(property: string) {
    const test = AwardMapper.toAward({} as AwardDto);
    return !!test.hasOwnProperty(property);
  }
}
