import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { TokenInfoDto } from '../../common/dtos/token-info-dto';
import { UserInfoDto } from '../../common/dtos/user-info-dto';
import { AuthState } from './types';

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState) => {
      state.isAuthenticated = true;
    },
    logout: (state: AuthState) => {
      state.isAuthenticated = false;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
      state.expiresAt = new Date(action.payload.exp * 1000);
    },
  },
});

export const { login, logout, setUserInfo, setTokenInfo } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
