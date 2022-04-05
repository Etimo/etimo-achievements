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

  return (
    <>
      <h1 className="font-sans text-xl font-bold text-center">Achievements</h1>
      <div className="w-full flex">
        <table className="table-auto w-full m-3 rounded-md bg-slate-100">
          <thead>
            <tr className="h-12">
              <th>Name</th>
              <th>Description</th>
              <th>Points</th>
              <th>Cooldown</th>
              <th>Repeatable</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id} className="h-8 odd:bg-white even:bg-gray-100">
                <td className="p-3">{a.name}</td>
                <td className="p-3">{a.description}</td>
                <td className="p-3">{a.achievementPoints} pts</td>
                <td className="p-3">{a.cooldownMinutes} min</td>
                <td className="p-3">Unsupported</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Achievements;
