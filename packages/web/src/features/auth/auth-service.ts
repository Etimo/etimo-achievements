import { AuthApi } from '../../api/auth-api';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { authSelector, setLoggedIn, setLoggedOut, setLoggingIn, setTokenInfo, setUserInfo } from './auth-slice';

export class AuthService {
  private authApi = new AuthApi();
  private dispatch = useAppDispatch();
  private auth = useAppSelector(authSelector);

  public async login(code: string) {
    this.dispatch(setLoggingIn());
    await this.getToken(code);
    await this.validateToken();
    this.getUserInfo();
    this.getTokenInfo();
  }

  public async refresh() {
    if (this.auth.isAuthenticating) {
      console.log('Refresh is already in progress');
      return;
    }

    const validateRes = await this.authApi.validate().wait();
    if (validateRes.success) {
      return this.dispatch(setLoggedIn());
    }

    const refreshRes = await this.authApi.refresh().wait();
    if (refreshRes.success) {
      return this.dispatch(setLoggedIn());
    }

    this.dispatch(setLoggedOut());
  }

  public async logout() {
    await this.authApi.logout().wait();
    this.dispatch(setLoggedOut());
  }

  private async getToken(code: string) {
    await this.authApi.callback('google', code).wait();
  }

  private async validateToken() {
    const response = await this.authApi.validate().wait();
    if (response.success) {
      return this.dispatch(setLoggedIn());
    }

    await this.logout();
  }

  private async getUserInfo() {
    const response = await this.authApi.userInfo().wait();
    if (response.success) {
      this.dispatch(setUserInfo(await response.data()));
    }
  }

  private async getTokenInfo() {
    const response = await this.authApi.introspect().wait();
    if (response.success) {
      this.dispatch(setTokenInfo(await response.data()));
    }
  }
}
