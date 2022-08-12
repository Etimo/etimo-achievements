import { SeasonDto } from '@etimo-achievements/common';
import { INewSeason, ISeason } from '@etimo-achievements/types';

export class SeasonMapper {
  public static toSeasonDto(season: ISeason): SeasonDto {
    return {
      id: season.id,
      name: season.name,
      description: season.description,
      periodEnd: season.periodEnd,
      periodStart: season.periodEnd,
    };
  }

  public static toSeason(seasonDto: SeasonDto): ISeason {
    return {
      id: seasonDto.id,
      name: seasonDto.name,
      description: seasonDto.description,
      periodStart: seasonDto.periodStart,
      periodEnd: seasonDto.periodEnd,
    };
  }

  public static toNewSeason(seasonDto: SeasonDto): INewSeason {
    return {
      name: seasonDto.name,
      description: seasonDto.description,
      periodEnd: seasonDto.periodEnd,
      periodStart: seasonDto.periodStart,
    };
  }

  public static isProperty(property: string) {
    const test = SeasonMapper.toSeason({} as SeasonDto);
    return !!test.hasOwnProperty(property);
  }
}
