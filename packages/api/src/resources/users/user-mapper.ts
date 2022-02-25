import { IUser } from '@etimo-achievements/types';
import { NewUserDto, UserDto } from './user-dto';

export class UserMapper {
  public static toUserDto(user: IUser): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      slackHandle: user.slackHandle,
    };
  }

  public static toUser(userDto: UserDto): Omit<IUser, 'password'> {
    return {
      id: userDto.id,
      name: userDto.name,
      email: userDto.email,
      slackHandle: userDto.slackHandle,
    };
  }

  public static toNewUser(newUserDto: NewUserDto): IUser {
    return {
      id: newUserDto.id,
      name: newUserDto.name,
      email: newUserDto.email,
      slackHandle: newUserDto.slackHandle,
    };
  }
}
