import { AccessTokenDto, TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AuthState } from './auth-types';

const initialState: AuthState = {
  isAuthenticating: false,
  isValidated: false,
  hasAccessToken: false,
  hasTokenInfo: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggingIn: (state: AuthState) => {
      state = { ...initialState, isAuthenticating: true };
    },
    setLoggedIn: (state: AuthState) => {
      state.isAuthenticating = false;
    },
    setValidated: (state: AuthState) => {
      state.isValidated = true;
    },
    setLoggedOut: (state: AuthState) => {
      state = initialState;
    },
    setAccessToken: (state: AuthState, action: { payload: AccessTokenDto }) => {
      state.accessToken = action.payload;
      state.expiresIn = action.payload.expires_in;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
      state.userId = action.payload.id;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
      state.hasTokenInfo = true;
    },
  },
});

export const { setLoggingIn, setLoggedIn, setValidated, setLoggedOut, setAccessToken, setUserInfo, setTokenInfo } =
  authSlice.actions;

export const userIdSelector = (state: RootState) => state.auth.userId;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
