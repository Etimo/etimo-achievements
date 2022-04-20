import { formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import {
  SkeletonTableRow,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '../../components/table';
import { AwardService } from './award-service';
import { awardSelector } from './award-slice';

const AwardList: React.FC = () => {
  const { composites } = useAppSelector(awardSelector);
  const awardService = new AwardService();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string>();

  useEffect(() => {
    awardService.load().then(() => setLoading(false));
  }, []);

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    awardService.delete(e.currentTarget.id).then((response) => {
      setDeleting(undefined);
      toastResponse(response, 'Award deleted successfully', 'Award could not be deleted');
    });
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Awarded To</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Date</TableColumn>
          <TableColumn>Awarded By</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonTableRow columns={6} rows={3} />
          ) : (
            sort(composites, 'award.createdAt', 'desc').map((row) => (
              <TableRow key={row.award.id}>
                <TableCell>{row.achievement.name}</TableCell>
                <TableCell>{row.awardedTo.name}</TableCell>
                <TableCell>{formatNumber(row.achievement.achievementPoints)} pts</TableCell>
                <TableCell>{new Date(row.award.createdAt ?? 0).toLocaleString('sv-SE')}</TableCell>
                <TableCell>{row.awardedBy.name}</TableCell>
                <TableCell className="text-center">
                  <TrashButton id={row.award.id} onClick={trashHandler} loading={deleting} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AwardList;
