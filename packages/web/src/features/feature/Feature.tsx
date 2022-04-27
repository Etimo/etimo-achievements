import React from 'react';
import useFeatureEnabled from './hooks/use-feature-enabled';

type Props = {
  name: string;
};

const Feature: React.FC<Props> = ({ name, children }) => {
  const enabled = useFeatureEnabled(name);

  return enabled ? <>{children}</> : null;
};

export default Feature;
