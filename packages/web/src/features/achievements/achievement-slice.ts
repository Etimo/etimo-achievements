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
    updateAchievement: (state: AchievementState, action: { payload: AchievementDto }) => {
      const index = state.achievements.findIndex((achievement) => achievement.id === action.payload.id);
      if (index !== -1) {
        state.achievements[index] = action.payload;
      } else {
        state.achievements.push(action.payload);
      }
    },
    updateAchievements: (state: AchievementState, action: { payload: AchievementDto[] }) => {
      action.payload.forEach((achievement) => {
        const index = state.achievements.findIndex((achievement) => achievement.id === achievement.id);
        if (index !== -1) {
          state.achievements[index] = achievement;
        } else {
          state.achievements.push(achievement);
        }
      });
    },
    deleteAchievement: (state: AchievementState, action: { payload: string }) => {
      state.achievements = state.achievements.filter((achievement) => achievement.id !== action.payload);
    },
  },
});

export const { setAchievements, updateAchievement, updateAchievements, deleteAchievement } = achievementSlice.actions;

export const achievementSelector = (state: RootState) => state.achievements;

export default achievementSlice.reducer;
