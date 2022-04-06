import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { AchievementDto } from '../../common/dtos/achievement-dto';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';

const AchievementsList = (): JSX.Element => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    achievementService.load();
  }, []);

  return (
    <div className="w-full place-content-center">
      <h1 className="font-sans text-2xl font-bold text-center pb-6">Achievements</h1>
      <table className="table-auto m-3 rounded-md border-collapse border border-slate-500">
        <thead>
          <tr className="h-12 bg-slate-600 text-slate-200">
            <th className="p-3 border border-slate-600">Name</th>
            <th className="p-3 border border-slate-600">Description</th>
            <th className="p-3 border border-slate-600">Points</th>
            <th className="p-3 border border-slate-600">Cooldown</th>
            <th className="p-3 border border-slate-600">Repeatable</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a: AchievementDto) => (
            <tr key={a.id} className="h-8 bg-slate-300">
              <td className="p-3 border border-slate-600">{a.name}</td>
              <td className="p-3 border border-slate-600">{a.description}</td>
              <td className="p-3 border border-slate-600">{formatNumber(a.achievementPoints)} pts</td>
              <td className="p-3 border border-slate-600">{formatNumber(a.cooldownMinutes)} min</td>
              <td className="p-3 border border-slate-600">Unsupported</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AchievementsList;
