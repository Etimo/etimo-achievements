import { useAppDispatch, useAppSelector } from '../../../app/store';
import { FeatureApi } from '../feature-api';
import { disableFeature, enableFeature, featureSelector } from '../feature-slice';

function useFeatureEnabled() {
  const dispatch = useAppDispatch();
  const features = useAppSelector(featureSelector);
  const api = new FeatureApi();

  return async (feature: string): Promise<boolean> => {
    if (features[feature] !== undefined) {
      return features[feature];
    }

    const result = await api.get(feature).wait();

    if (result.success) {
      const enabled = await result.data();
      if (enabled === true) dispatch(enableFeature(feature));
      else dispatch(disableFeature(feature));
      return enabled;
    }

    return false;
  };
}

export default useFeatureEnabled;
