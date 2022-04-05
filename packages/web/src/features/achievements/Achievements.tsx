import React, { useEffect, useState } from 'react';
import { AchievementApi } from '../../api/achievement-api';
import { AchievementDto } from '../../common/dtos/achievement-dto';

const Achievements = (): JSX.Element => {
  const [achievements, setAchievements] = useState([] as AchievementDto[]);

  useEffect(() => {}, []);

  console.log(achievements);
  const renderAchievements = achievements.map((a) => {
    return (
      <div key={a.id}>
        <h1>{a.name}</h1>
        <p>{a.description}</p>
      </div>
    );
  });

  return <>{renderAchievements}</>;
};

export default Achievements;
