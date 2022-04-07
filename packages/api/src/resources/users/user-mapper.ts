import { IUser } from '@etimo-achievements/types';
import { UserDto } from '@etimo-achievements/common';

export class UserMapper {
  public static toUserDto(user: IUser): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      slackHandle: user.slackHandle,
    };
  }

  public static toUser(userDto: UserDto): IUser {
    return {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      slackHandle: userDto.slackHandle,
    };
  }
}
