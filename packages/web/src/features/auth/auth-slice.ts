import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AuthState } from './auth-types';

const initialState: AuthState = {
  authenticated: false,
  authenticating: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggingIn: (state: AuthState) => {
      state.authenticating = true;
    },
    setLoggedIn: (state: AuthState) => {
      state.authenticated = true;
      state.authenticating = false;
    },
    setLoggedOut: (state: AuthState) => {
      state.authenticated = false;
      state.authenticating = false;
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

export const { setLoggedIn, setLoggedOut, setAccessToken, setUserInfo, setTokenInfo } = authSlice.actions;

export const userIdSelector = (state: RootState) => state.auth.userId;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
