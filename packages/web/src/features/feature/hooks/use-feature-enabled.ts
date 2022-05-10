import { getFeature } from '@etimo-achievements/common';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { disableFeature, enableFeature, featureSelector } from '../feature-slice';

function useFeatureEnabled(feature: string) {
  const dispatch = useAppDispatch();
  const features = useAppSelector(featureSelector);

  useEffect(() => {
    getFeature(feature).then((response) => {
      if (response.success) {
        response.data().then((data) => {
          dispatch(data === true ? enableFeature(feature) : disableFeature(feature));
        });
      }
    });
  }, []);

  return features[feature];
}

export default useFeatureEnabled;
