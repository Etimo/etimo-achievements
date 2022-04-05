import { Logger } from '@etimo-achievements/common';
import { AuthApi } from '../../api/auth-api';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { authSelector, setLoggedIn, setLoggedOut, setLoggingIn, setTokenInfo, setUserInfo } from './auth-slice';
import { AuthStorageKeys } from './types';

export class AuthService {
  private authApi = new AuthApi();
  private dispatch = useAppDispatch();
  private auth = useAppSelector(authSelector);

  public async initialize() {
    if (this.isAuthenticated || (await this.refresh())) {
      this.setRefreshTimer();
      this.getInfo();
    }
  }

  public async login(code: string) {
    this.dispatch(setLoggingIn());
    await this.getToken(code);
    await this.validateToken();
    this.getInfo();
  }

  public get isAuthenticated() {
    const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
    if (expiresAt) {
      this.dispatch(setLoggedIn(+expiresAt));
      return +expiresAt > Date.now();
    }

    return false;
  }

  public setRefreshTimer() {
    const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
    const expiresIn = expiresAt ? +expiresAt - Date.now() : 0;

    if (expiresIn > 0) {
      Logger.log('Setting refresh token timer for ' + expiresIn / 1000 + ' seconds');
      setTimeout(() => this.refresh(), expiresIn);
    } else {
      this.refresh();
    }
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
    this.dispatch(setLoggingIn());

    await this.authApi.logout().wait();

    this.dispatch(setLoggedOut());
    localStorage.clear();
  }

  public getInfo() {
    this.getUserInfo();
    this.getTokenInfo();
  }

  private dispatchLogin(expiresIn: number) {
    localStorage.setItem(AuthStorageKeys.ExpiresAt, (Date.now() + expiresIn * 1000).toString());

    this.setRefreshTimer();
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
    } else if (response.status === 401) {
      await this.logout();
    }
  }

  private async getTokenInfo() {
    const response = await this.authApi.introspect().wait();
    if (response.success) {
      this.dispatch(setTokenInfo(await response.data()));
    } else if (response.status === 401) {
      await this.logout();
    }
  }
}
