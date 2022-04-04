import { TokenInfoDto } from '../../common/dtos/token-info-dto';
import { UserDto } from '../../common/dtos/user-dto';
import { UserInfoDto } from '../../common/dtos/user-info-dto';

export interface AuthState {
  isAuthenticated: boolean;
  user?: UserDto;
  userInfo?: UserInfoDto;
  tokenInfo?: TokenInfoDto;
}
