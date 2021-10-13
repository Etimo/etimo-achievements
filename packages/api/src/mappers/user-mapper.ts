import { IUser } from '@etimo-achievements/data';
import { UserDto } from '../dtos';

export class UserMapper {
  public static toUserDto(user: IUser): UserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
