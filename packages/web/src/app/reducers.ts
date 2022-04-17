import { combineReducers } from '@reduxjs/toolkit';
import achievementReducer from '../features/achievements/achievement-slice';
import authReducer from '../features/auth/auth-slice';
import awardReducer from '../features/awards/award-slice';
import rankingReducer from '../features/ranking/ranking-slice';
import userReducer from '../features/users/user-slice';

const rootReducer = combineReducers({
  auth: authReducer,
  achievements: achievementReducer,
  awards: awardReducer,
  users: userReducer,
  ranking: rankingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
