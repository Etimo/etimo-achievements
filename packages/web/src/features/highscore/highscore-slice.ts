import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { HighscoreComposite, HighscoreState } from './highscore-types';

const initialState: HighscoreState = {
  highscores: [],
};

const highscoreSlice = createSlice({
  name: 'highscore',
  initialState,
  reducers: {
    setHighscore: (state: HighscoreState, action: { payload: HighscoreComposite[] }) => {
      state.highscores = action.payload;
    },
  },
});

export const { setHighscore } = highscoreSlice.actions;

export const highscoreSelector = (state: RootState) => state.highscores;

export default highscoreSlice.reducer;
