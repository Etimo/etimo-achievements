import { UserDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { UserState } from './user-types';

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state: UserState, action: { payload: UserDto[] }) => {
      state.users = action.payload;
    },
    updateUser: (state: UserState, action: { payload: UserDto }) => {
      const index = state.users.findIndex((user: UserDto) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      } else {
        state.users.push(action.payload);
      }
    },
    updateUsers: (state: UserState, action: { payload: UserDto[] }) => {
      action.payload.forEach((user: UserDto) => {
        const index = state.users.findIndex((u: UserDto) => u.id === user.id);
        if (index !== -1) {
          state.users[index] = user;
        } else {
          state.users.push(user);
        }
      });
    },
    deleteUser: (state: UserState, action: { payload: string }) => {
      state.users = state.users.filter((user: UserDto) => user.id !== action.payload);
    },
  },
});

export const { setUsers, updateUser, updateUsers, deleteUser } = userSlice.actions;

export const profileSelector = (state: RootState) =>
  state.users.users.find((user: UserDto) => user.id === state.auth.userId);
export const usersSelector = (state: RootState) => state.users;

export default userSlice.reducer;
