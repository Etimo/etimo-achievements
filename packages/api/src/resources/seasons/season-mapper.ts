import { SeasonDto } from '@etimo-achievements/common';
import { ISeason } from '@etimo-achievements/types';

export class SeasonMapper {
  public static toSeasonDto(season: ISeason): SeasonDto {
    return {
      id: season.id,
      name: season.name,
      endsAt: season.endsAt,
      startsAt: season.startsAt,
    };
  }

  public static toSeason(seasonDto: SeasonDto): ISeason {
    return {
      id: seasonDto.id,
      name: seasonDto.name,
      endsAt: seasonDto.endsAt,
      startsAt: seasonDto.startsAt,
    };
  }

  public static isProperty(property: string) {
    const test = SeasonMapper.toSeason({} as SeasonDto);
    return !!test.hasOwnProperty(property);
  }
}
