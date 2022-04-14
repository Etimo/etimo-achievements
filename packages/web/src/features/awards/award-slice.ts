import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { AwardComposite, AwardState } from './award-types';

const initialState: AwardState = {
  composites: [],
};

const awardSlice = createSlice({
  name: 'awards',
  initialState,
  reducers: {
    setAwards: (state: AwardState, action: { payload: AwardComposite[] }) => {
      state.composites = action.payload;
    },
    deleteAward: (state: AwardState, action: { payload: string }) => {
      state.composites = state.composites.filter((composite) => composite.award.id !== action.payload);
    },
  },
});

export const { setAwards, deleteAward } = awardSlice.actions;

export const awardSelector = (state: RootState) => state.awards;

export default awardSlice.reducer;
