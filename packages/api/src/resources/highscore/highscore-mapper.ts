import { HighscoreDto } from '@etimo-achievements/common';
import { IHighscore } from '@etimo-achievements/types';

export class HighscoreMapper {
  public static toHighscoreDto(award: IHighscore): HighscoreDto {
    return {
      userId: award.userId,
      achievements: award.achievements,
      points: award.points,
      kickback: award.kickback,
      totalPoints: award.totalPoints,
    };
  }

  public static isProperty(property: string) {
    const test = HighscoreMapper.toHighscoreDto({} as IHighscore);
    return !!test.hasOwnProperty(property);
  }
}
