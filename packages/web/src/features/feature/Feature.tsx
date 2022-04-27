import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { featureSelector } from './feature-slice';
import useFeatureEnabled from './hooks/use-feature-enabled';

type Props = {
  name: string;
};

const Feature: React.FC<Props> = ({ name, children }) => {
  const features = useAppSelector(featureSelector);
  const featureEnabled = useFeatureEnabled();

  useEffect(() => {
    featureEnabled(name);
  }, []);

  return features[name] === true ? <>{children}</> : null;
};

export default Feature;
