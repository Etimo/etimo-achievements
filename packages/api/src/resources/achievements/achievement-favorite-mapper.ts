import { AchievementFavoriteDto } from '@etimo-achievements/common';
import { IAchievementFavorite } from '@etimo-achievements/types';

export class AchievementFavoriteMapper {
  public static toAchievementFavoriteDto(a: IAchievementFavorite): AchievementFavoriteDto {
    return {
      id: a.id,
      achievementId: a.achievementId,
      userId: a.userId,
    };
  }

  public static toAchievement(a: AchievementFavoriteDto): IAchievementFavorite {
    return {
      id: a.id,
      achievementId: a.achievementId,
      userId: a.userId,
    };
  }

  public static isProperty(property: string) {
    const test = AchievementFavoriteMapper.toAchievement({} as AchievementFavoriteDto);
    return !!test.hasOwnProperty(property);
  }
}
