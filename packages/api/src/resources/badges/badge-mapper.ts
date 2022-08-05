import { BadgeDto } from '@etimo-achievements/common';
import { IBadge } from '@etimo-achievements/types';

export class BadgeMapper {
  public static toBadgeDto(badge: IBadge): BadgeDto {
    return {
      id: badge.id,
      name: badge.name,
      description: badge.description,
    };
  }

  public static toBadge(badgeDto: BadgeDto): IBadge {
    return {
      id: badgeDto.id,
      name: badgeDto.name,
      description: badgeDto.description,
    };
  }

  public static isProperty(property: string) {
    const test = BadgeMapper.toBadge({} as BadgeDto);
    return !!test.hasOwnProperty(property);
  }
}
