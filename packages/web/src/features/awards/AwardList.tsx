import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/store';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import { AwardService } from './award-service';
import { awardSelector } from './award-slice';

const AwardList: React.FC = () => {
  const { composites } = useAppSelector(awardSelector);
  const awardService = new AwardService();
  const [loading, setLoading] = useState(false);
  const formatNumber = Intl.NumberFormat('sv-SE').format;

  useEffect(() => {
    awardService.load();
  }, []);

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    awardService.delete(e.currentTarget.id).then((success) => {
      setLoading(false);
      if (success) {
        toast.success('Award deleted successfully.');
      } else {
        toast.error('Award could not be deleted');
      }
    });
  };

  return (
    <div className="w-1/2 mx-auto">
      <Header>Awards</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Awarded To</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Awarded By</TableColumn>
        </TableHeader>
        <TableBody>
          {composites.map((row) => (
            <TableRow key={row.award.id}>
              <TableCell>{row.achievement.name}</TableCell>
              <TableCell>{row.awardedTo.name}</TableCell>
              <TableCell>{row.achievement.achievementPoints} pts</TableCell>
              <TableCell>{new Date(row.award.createdAt ?? 0).toLocaleString('sv-SE')}</TableCell>
              <TableCell className="text-center">
                <TrashButton id={row.award.id} onClick={trashHandler} loading={loading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AwardList;
