import { AchievementDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AchievementState } from './achievement-types';

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
    deleteAchievement: (state: AchievementState, action: { payload: string }) => {
      state.achievements = state.achievements.filter((achievement) => achievement.id !== action.payload);
    },
  },
});

export const { setAchievements, deleteAchievement } = achievementSlice.actions;

export const achievementSelector = (state: RootState) => state.achievements;

export default achievementSlice.reducer;
