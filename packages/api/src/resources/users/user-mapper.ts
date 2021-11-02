import { IUser } from '@etimo-achievements/data';
import { NewUserDto, UserDto } from './user-dto';

export class UserMapper {
  public static toUserDto(user: IUser): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      slackHandle: user.slackHandle,
    };
  }

  public static toUser(userDto: UserDto): Omit<IUser, 'password'> {
    return {
      id: userDto.id,
      username: userDto.username,
      email: userDto.email,
      slackHandle: userDto.slackHandle,
    };
  }

  public static toNewUser(newUserDto: NewUserDto): IUser {
    return {
      id: newUserDto.id,
      username: newUserDto.username,
      password: newUserDto.password,
      email: newUserDto.email,
      slackHandle: newUserDto.slackHandle,
    };
  }
}
