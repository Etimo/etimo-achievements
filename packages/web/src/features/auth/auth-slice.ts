import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AuthState, LoginState } from './auth-types';

const initialState: AuthState = {
  authenticated: false,
  loginState: 'logged-out',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginState: (state: AuthState, action: { payload: LoginState }) => {
      state.loginState = action.payload;

      switch (action.payload) {
        case 'logged-in':
          state.authenticated = true;
          break;

        case 'logged-out':
          state.authenticated = false;
          break;
      }
    },
    setLoggedOut: (state: AuthState) => {
      state.authenticated = false;
      state.loginState = 'logged-out';
      state.expiresAt = 0;
      state.userId = undefined;
      state.accessToken = undefined;
      state.userInfo = undefined;
      state.tokenInfo = undefined;
    },
    setAccessToken: (state: AuthState, action: { payload: AccessTokenDto }) => {
      state.accessToken = action.payload;
      state.expiresAt = Date.now() + action.payload.expires_in * 1000;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
      state.userId = action.payload.id;
    },
  },
});

export const { setLoginState, setLoggedOut, setAccessToken, setUserInfo, setTokenInfo } = authSlice.actions;

export const userIdSelector = (state: RootState) => state.auth.userId;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
