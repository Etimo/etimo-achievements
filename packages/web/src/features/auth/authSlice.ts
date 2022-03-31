import { IUser } from '@etimo-achievements/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/rootReducer';
import { AuthError, AuthState } from './types';

export const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  error: { message: 'An error occurred' },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state: AuthState, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    setAuthSuccess: (state: AuthState, { payload }: PayloadAction<IUser>) => {
      state.currentUser = payload;
      state.isAuth = true;
    },
    setLogOut: (state: AuthState) => {
      state.isAuth = false;
      state.currentUser = undefined;
    },
    setAuthFailed: (state: AuthState, { payload }: PayloadAction<AuthError>) => {
      state.error = payload;
      state.isAuth = false;
    },
  },
});

export const { setAuthSuccess, setLogOut, setLoading, setAuthFailed } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
