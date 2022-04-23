import { combineReducers } from '@reduxjs/toolkit';
import achievementReducer from '../features/achievements/achievement-slice';
import authReducer from '../features/auth/auth-slice';
import userReducer from '../features/users/user-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  achievements: achievementReducer,
  users: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
