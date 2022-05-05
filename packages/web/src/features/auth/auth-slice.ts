import { TokenInfoDto, UserInfoDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AuthState } from './auth-types';

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isValidated: false,
  hasTokenInfo: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggingIn: (state: AuthState) => {
      state.isAuthenticated = false;
      state.isAuthenticating = true;
      state.isValidated = false;
    },
    setLoggedIn: (state: AuthState) => {
      state.isAuthenticated = true;
      state.isAuthenticating = false;
    },
    setValidated: (state: AuthState) => {
      state.isValidated = true;
    },
    setLoggedOut: (state: AuthState) => {
      state.isAuthenticated = false;
      state.isAuthenticating = false;
      state.isValidated = false;
      state.userInfo = undefined;
      state.userId = undefined;
      state.tokenInfo = undefined;
      state.hasTokenInfo = false;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
      state.userId = action.payload.id;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
      state.expiresIn = action.payload.exp;
      state.hasTokenInfo = true;
    },
  },
});

export const { setLoggingIn, setLoggedIn, setValidated, setLoggedOut, setUserInfo, setTokenInfo } = authSlice.actions;

export const userIdSelector = (state: RootState) => state.auth.userId;
export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
