import { combineReducers } from '@reduxjs/toolkit';
import achievementReducer from '../features/achievements/achievement-slice';
import authReducer from '../features/auth/auth-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  achievements: achievementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
