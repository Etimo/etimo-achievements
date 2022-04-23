import { Logger } from '@etimo-achievements/common';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { LocalStorage } from '../../common/enums/local-storage';
import { AuthApi } from './auth-api';
import { authSelector, setLoggedIn, setLoggedOut, setLoggingIn, setTokenInfo, setUserInfo } from './auth-slice';
import { AuthStorageKeys } from './auth-types';

export class AuthService {
  private authApi = new AuthApi();
  private dispatch = useAppDispatch();
  private auth = useAppSelector(authSelector);
  private authenticated = false;

  public async initialize() {
    if (this.isAuthenticated()) {
      this.dispatch(setLoggedIn());
      this.setRefreshTimer();
      return true;
    } else if (await this.refresh()) {
      return true;
    }

    return false;
  }

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

    await this.logout();

    return false;
  }

  public async logout() {
    await this.authApi.logout().wait();

    /*
      The redirect url is set before the token is refreshed.
      When the token fails to refresh, this function is called,
      and the local storage is cleared. Because of this, we need
      to save the redirectUrl in a variable, clear local storage
      and then set the redirectUrl again in local storage, to allow
      the user to be redirected properly after getting his/her token.
    */
    const redirectUrl = localStorage.getItem(LocalStorage.RedirectUrl);
    localStorage.clear();
    if (redirectUrl) {
      localStorage.setItem(LocalStorage.RedirectUrl, redirectUrl);
    }

    this.dispatch(setLoggedOut());
  }

  public getInfo() {
    if (this.isAuthenticated() || this.authenticated) {
      this.getUserInfo();
      this.getTokenInfo();
    }
  }

  private isAuthenticated() {
    const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
    if (expiresAt) {
      const isAuthed = +expiresAt > Date.now();
      return isAuthed;
    }

    return false;
  }

  private setRefreshTimer() {
    const expiresAt = localStorage.getItem(AuthStorageKeys.ExpiresAt);
    const expiresIn = expiresAt ? +expiresAt - Date.now() - 2000 : 0;

    if (expiresIn > 0) {
      Logger.log('Setting refresh token timer for ' + expiresIn / 1000 + ' seconds');
      setTimeout(() => this.refresh(), expiresIn);
    } else {
      this.refresh();
    }
  }

  private dispatchLogin(expiresIn: number) {
    localStorage.setItem(AuthStorageKeys.ExpiresAt, (Date.now() + expiresIn * 1000).toString());

    this.setRefreshTimer();
    this.dispatch(setLoggedIn());
    this.authenticated = true;

    return true;
  }

  private async getToken(code: string) {
    await this.authApi.callback('google', code).wait();
  }

  private async validateToken() {
    const response = await this.authApi.validate().wait();
    if (response.success) {
      const data = await response.data();
      this.dispatchLogin(data.expires_in);
    } else {
      this.logout();
    }
  }

  private async getTokenInfo() {
    const response = await this.authApi.introspect().wait();
    if (response.success) {
      this.dispatch(setTokenInfo(await response.data()));
    } else if (response.status === 401) {
      this.logout();
    }
  }

  private async getUserInfo() {
    const response = await this.authApi.userInfo().wait();
    if (response.success) {
      this.dispatch(setUserInfo(await response.data()));
    }
  }
}
