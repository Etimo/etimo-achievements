import { AchievementDto } from '@etimo-achievements/common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import Spinner from '../../components/Spinner';
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
                <button id={a.id} onClick={trashHandler}>
                  {loading ? <Spinner /> : <FontAwesomeIcon icon={faTrash} className="hover:text-slate-700" />}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AchievementsList;
