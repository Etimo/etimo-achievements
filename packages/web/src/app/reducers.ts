import { combineReducers } from '@reduxjs/toolkit';
import achievementReducer from '../features/achievements/achievement-slice';
import authReducer from '../features/auth/auth-slice';
import featureReducer from '../features/feature/feature-slice';
import userReducer from '../features/users/user-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  achievements: achievementReducer,
  features: featureReducer,
  users: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
