import { useAppDispatch } from '../../app/store';
import { TokenInfoDto } from '../../common/dtos/token-info-dto';
import { UserInfoDto } from '../../common/dtos/user-info-dto';
import Api from '../../common/utils/api';
import { setLoggedIn, setTokenInfo, setUserInfo } from './auth-slice';

export class LoginService {
  private api = new Api();
  private dispatch = useAppDispatch();

  public async loginWithCode(code: string) {
    await this.getToken(code);
    await this.validateToken();
    this.getUserInfo();
    this.getTokenInfo();
  }

  private async getToken(code: string) {
    await this.api.get(`/auth/callback/google?code=${code}`).wait();
  }

  private async validateToken() {
    const response = await this.api.get('/auth/validate').wait();
    if (response.success) {
      this.dispatch(setLoggedIn());
    }
  }

  private async getUserInfo() {
    const response = await this.api.get<UserInfoDto>('/auth/userinfo').wait();
    if (response.success) {
      this.dispatch(setUserInfo(await response.data()));
    }
  }

  private async getTokenInfo() {
    const response = await this.api.get<TokenInfoDto>('/auth/introspect').wait();
    if (response.success) {
      this.dispatch(setTokenInfo(await response.data()));
    }
  }
}
