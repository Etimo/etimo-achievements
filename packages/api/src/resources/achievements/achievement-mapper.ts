import { AchievementDto } from '@etimo-achievements/common';
import { IAchievement } from '@etimo-achievements/types';

export class AchievementMapper {
  public static toAchievementDto(achievement: IAchievement): AchievementDto {
    return {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      achievementPoints: achievement.achievementPoints,
      cooldownMinutes: achievement.cooldownMinutes,
    };
  }

  public static toAchievement(achievementDto: AchievementDto): IAchievement {
    return {
      id: achievementDto.id,
      name: achievementDto.name,
      description: achievementDto.description,
      achievementPoints: achievementDto.achievementPoints,
      cooldownMinutes: achievementDto.cooldownMinutes,
    };
  }

  public static isProperty(property: string) {
    const test = AchievementMapper.toAchievement({} as AchievementDto);
    return !!test.hasOwnProperty(property);
  }
}
