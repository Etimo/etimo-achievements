import { UserDto } from '@etimo-achievements/common';
import { IUser } from '@etimo-achievements/types';

export class UserMapper {
  public static toUserDto(user: IUser): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      slackHandle: user.slackHandle,
      image: user.image,
    };
  }

  public static toUser(userDto: UserDto): IUser {
    return {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      slackHandle: userDto.slackHandle,
      image: userDto.image,
    };
  }

  public static isProperty(property: string) {
    const test = UserMapper.toUser({} as UserDto);
    return !!test.hasOwnProperty(property);
  }
}
