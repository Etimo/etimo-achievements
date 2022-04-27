import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reducers';
import { FeatureState } from './feature-types';

const initialState: FeatureState = {};

const featureSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    enableFeature: (state: FeatureState, action: { payload: string }) => {
      state[action.payload] = true;
    },
    disableFeature: (state: FeatureState, action: { payload: string }) => {
      state[action.payload] = false;
    },
  },
});

export const { enableFeature, disableFeature } = featureSlice.actions;

export const featureSelector = (state: RootState) => state.features;

export default featureSlice.reducer;
