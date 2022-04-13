import { AwardDto } from '@etimo-achievements/common';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AwardState } from './award-types';

const initialState: AwardState = {
  awards: [],
};

const awardSlice = createSlice({
  name: 'awards',
  initialState,
  reducers: {
    setAwards: (state: AwardState, action: { payload: AwardDto[] }) => {
      state.awards = action.payload;
    },
    updateAward: (state: AwardState, action: { payload: AwardDto }) => {
      const index = state.awards.findIndex((award) => award.id === action.payload.id);
      if (index !== -1) {
        state.awards[index] = action.payload;
      } else {
        state.awards.push(action.payload);
      }
    },
    deleteAward: (state: AwardState, action: { payload: string }) => {
      state.awards = state.awards.filter((award) => award.id !== action.payload);
    },
  },
});

export const { setAwards, updateAward, deleteAward } = awardSlice.actions;

export const awardSelector = (state: RootState) => state.awards;

export default awardSlice.reducer;
