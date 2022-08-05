import { BadgeAwardDto } from '@etimo-achievements/common';
import { IBadgeAward, INewBadgeAward } from '@etimo-achievements/types';

export class BadgeAwardMapper {
  public static toAwardDto(award: IBadgeAward): BadgeAwardDto {
    return {
      id: award.id,
      badgeId: award.badgeId,
      awardedByUserId: award.awardedByUserId,
      userId: award.userId,
      createdAt: award.createdAt,
    };
  }

  public static toAward(dto: BadgeAwardDto): IBadgeAward {
    return {
      id: dto.id,
      badgeId: dto.badgeId,
      awardedByUserId: dto.awardedByUserId,
      userId: dto.userId,
      createdAt: dto.createdAt ?? new Date(),
    };
  }

  public static toNewAward(awardDto: BadgeAwardDto): INewBadgeAward {
    return {
      badgeId: awardDto.badgeId,
      awardedByUserId: awardDto.awardedByUserId,
      userId: awardDto.userId,
    };
  }

  public static isProperty(property: string) {
    const test = BadgeAwardMapper.toAward({} as BadgeAwardDto);
    return !!test.hasOwnProperty(property);
  }
}
