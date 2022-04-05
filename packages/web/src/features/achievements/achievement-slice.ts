import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AchievementDto } from '../../common/dtos/achievement-dto';
import { AchievementState } from './types';

const initialState: AchievementState = {
  achievements: [],
};

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    setAchievements: (state: AchievementState, action: { payload: AchievementDto[] }) => {
      state.achievements = action.payload;
    },
  },
});

export const { setAchievements } = achievementSlice.actions;

export const achievementSelector = (state: RootState) => state.achievements;

export default achievementSlice.reducer;
