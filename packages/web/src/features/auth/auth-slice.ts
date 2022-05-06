import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AuthState } from './auth-types';

const initialState: AuthState = {
  isLoggedIn: false,
  isAuthenticating: false,
  isValidated: false,
  hasAccessToken: false,
  hasTokenInfo: false,
  hasUserInfo: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticating: (state: AuthState, action: { payload: boolean }) => {
      state.isAuthenticating = action.payload;
    },
    setLoggingIn: (state: AuthState) => {
      state.isAuthenticating = true;
    },
    setLoggedIn: (state: AuthState) => {
      state.isAuthenticating = false;
      state.isLoggedIn = true;
    },
    setValidated: (state: AuthState) => {
      state.isValidated = true;
    },
    setLoggedOut: (state: AuthState) => {
      state.isLoggedIn = false;
      state.isAuthenticating = false;
      state.isValidated = false;
      state.hasAccessToken = false;
      state.hasTokenInfo = false;
      state.hasUserInfo = false;
      state.expiresIn = 0;
      state.userId = undefined;
      state.accessToken = undefined;
      state.userInfo = undefined;
      state.tokenInfo = undefined;
    },
    setAccessToken: (state: AuthState, action: { payload: AccessTokenDto }) => {
      state.accessToken = action.payload;
      state.expiresIn = action.payload.expires_in * 1000;
      state.hasAccessToken = true;
      state.isAuthenticating = false;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
      state.hasTokenInfo = true;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
      state.userId = action.payload.id;
      state.hasUserInfo = true;
    },
  },
});

export const {
  setAuthenticating,
  setLoggingIn,
  setLoggedIn,
  setValidated,
  setLoggedOut,
  setAccessToken,
  setUserInfo,
  setTokenInfo,
} = authSlice.actions;

export const userIdSelector = (state: RootState) => state.auth.userId;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
