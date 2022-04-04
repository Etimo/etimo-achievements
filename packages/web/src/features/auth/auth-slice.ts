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
    setLoggedIn: (state: AuthState) => {
      state.isAuthenticated = true;
    },
    setLoggedOut: (state: AuthState) => {
      state.isAuthenticated = false;
    },
    setUserInfo: (state: AuthState, action: { payload: UserInfoDto }) => {
      state.userInfo = action.payload;
    },
    setTokenInfo: (state: AuthState, action: { payload: TokenInfoDto }) => {
      state.tokenInfo = action.payload;
    },
  },
});

export const selectExpiresAt = (state: RootState) => {
  const auth = authSelector(state);
  if (auth.tokenInfo) {
    return new Date(auth.tokenInfo.exp * 1000);
  }
};

export const { setLoggedIn, setLoggedOut, setUserInfo, setTokenInfo } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
