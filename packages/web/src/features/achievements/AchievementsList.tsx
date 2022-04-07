import { AchievementDto } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import TrashButton from '../../components/TrashButton';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';

const AchievementsList = (): JSX.Element => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();
  const [loading, setLoading] = useState(false);
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    achievementService.load();
  }, []);

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    achievementService.delete(e.currentTarget.id).then((success) => {
      setLoading(false);
      if (success) {
        toast.success('Achievement deleted successfully.');
      } else {
        toast.error('Achievement could not be deleted');
      }
    });
  };

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
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {achievements.map((a: AchievementDto) => (
            <TableRow>
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{formatNumber(a.achievementPoints)} pts</TableCell>
              <TableCell>{formatNumber(a.cooldownMinutes)} min</TableCell>
              <TableCell>Unsupported</TableCell>
              <TableCell className="text-center">
                <TrashButton id={a.id} onClick={trashHandler} loading={loading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AchievementsList;
