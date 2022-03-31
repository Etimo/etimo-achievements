import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
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
  },
});

export const { login, logout } = authSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
