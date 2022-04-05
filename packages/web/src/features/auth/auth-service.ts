import { Logger } from '@etimo-achievements/common';
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
    this.getInfo();
  }

  public async refresh() {
    if (this.auth.isAuthenticating) {
      Logger.log('Authentication already in progress');
      return false;
    }

    const refreshRes = await this.authApi.refresh().wait();
    if (refreshRes.success) {
      const data = await refreshRes.data();
      return this.dispatchLogin(data.expires_in);
    }

    this.dispatch(setLoggedOut());

    return false;
  }

  public async logout() {
    await this.authApi.logout().wait();
    this.dispatch(setLoggedOut());
  }

  public getInfo() {
    this.getUserInfo();
    this.getTokenInfo();
  }

  private dispatchLogin(expiresIn: number) {
    Logger.log('Setting refresh token timer for ' + expiresIn + ' seconds');
    setTimeout(() => this.refresh(), expiresIn * 1000);
    this.dispatch(setLoggedIn(expiresIn));

    return true;
  }

  private async getToken(code: string) {
    await this.authApi.callback('google', code).wait();
  }

  private async validateToken() {
    const response = await this.authApi.validate().wait();
    if (response.success) {
      const data = await response.data();
      return this.dispatchLogin(data.expires_in);
    }

    await this.logout();
    return false;
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
