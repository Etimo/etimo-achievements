import { IAchievement } from '@etimo-achievements/data';
import { AchievementsDto } from './achievement-dto';

export class AchievementMapper {
  public static toAchievementDto(achievement: IAchievement): AchievementsDto {
    return {
      id: achievement.id,
      achievement: achievement.achievement,
      description: achievement.description,
    };
  }

  public static toAchievement(achievementDto: AchievementsDto): IAchievement {
    return {
      id: achievementDto.id,
      achievement: achievementDto.achievement,
      description: achievementDto.description,
    };
  }
}
