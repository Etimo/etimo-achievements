import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';

const Achievements = (): JSX.Element => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();

  useEffect(() => {
    achievementService.load();
  }, []);

  const achievementsRender = achievements.map((a) => (
    <div key={a.id}>
      <h1>{a.name}</h1>
      <p>{a.description}</p>
    </div>
  ));

  return <>{achievementsRender}</>;
};

export default Achievements;
