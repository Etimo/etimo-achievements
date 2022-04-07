import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/store';
import { AchievementDto } from '../../common/dtos/achievement-dto';
import Table from '../../components/table/Table';
import TableBody from '../../components/table/TableBody';
import TableCell from '../../components/table/TableCell';
import TableColumn from '../../components/table/TableColumn';
import TableHeader from '../../components/table/TableHeader';
import TableRow from '../../components/table/TableRow';
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
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Cooldown</TableColumn>
          <TableColumn>Repeatable</TableColumn>
        </TableHeader>
        <TableBody>
          {achievements.map((a: AchievementDto) => (
            <TableRow>
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{formatNumber(a.achievementPoints)} pts</TableCell>
              <TableCell>{formatNumber(a.cooldownMinutes)} min</TableCell>
              <TableCell>Unsupported</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AchievementsList;
