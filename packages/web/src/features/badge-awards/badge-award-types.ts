import { BadgeAwardDto, BadgeDto, UserDto } from '@etimo-achievements/common';

export type BadgeAwardComposite = {
  badgeAward: BadgeAwardDto;
  awardedTo: UserDto;
  awardedBy: UserDto;
  badge: BadgeDto;
};
