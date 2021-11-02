import { IAchievement } from '@etimo-achievements/data';
import { AchievementDto } from './achievement-dto';

export class AchievementMapper {
  public static toAchievementDto(achievement: IAchievement): AchievementDto {
    return {
      id: achievement.id,
      achievement: achievement.achievement,
      description: achievement.description,
    };
  }

  public static toAchievement(achievementDto: AchievementDto): IAchievement {
    return {
      id: achievementDto.id,
      achievement: achievementDto.achievement,
      description: achievementDto.description,
    };
  }
}
