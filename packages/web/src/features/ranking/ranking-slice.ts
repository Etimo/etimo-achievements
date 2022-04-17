import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { RankingComposite, RankingState } from './ranking-types';

const initialState: RankingState = {
  rankings: [],
};

const rankingSlice = createSlice({
  name: 'ranking',
  initialState,
  reducers: {
    setRanking: (state: RankingState, action: { payload: RankingComposite[] }) => {
      state.rankings = action.payload;
    },
  },
});

export const { setRanking } = rankingSlice.actions;

export const rankingSelector = (state: RootState) => state.ranking;

export default rankingSlice.reducer;
