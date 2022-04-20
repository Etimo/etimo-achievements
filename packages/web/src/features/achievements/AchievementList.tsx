import { AchievementDto, formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [editAchievement, setEditAchievement] = useState<AchievementDto>();

  useEffect(() => {
    achievementService.load().then(() => setLoading(false));
  }, []);

  const closeModal = () => {
    setEditAchievement(undefined);
  };

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    achievementService.delete(e.currentTarget.id).then((response) => {
      setDeleting(undefined);
      toastResponse(response, 'Achievement deleted successfully', 'Achievement could not be deleted');
    });
  };

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const achievement = achievements.find((a) => a.id === e.currentTarget.id);
    if (achievement) {
      setEditAchievement(achievement);
    }
  };

  return (
    <div className="w-1/2 mx-auto">
      <Header>Achievements</Header>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Points</TableColumn>
          <TableColumn>Cooldown</TableColumn>
          <TableColumn>Repeatable</TableColumn>
          <TableColumn>Edit</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {sort(achievements, 'name').map((a: AchievementDto) => (
            <TableRow key={a.id}>
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{formatNumber(a.achievementPoints)} pts</TableCell>
              <TableCell>{formatNumber(a.cooldownMinutes)} min</TableCell>
              <TableCell>Unsupported</TableCell>
              <TableCell className="text-center">
                <EditButton id={a.id} onClick={editHandler} />
              </TableCell>
              <TableCell className="text-center">
                <TrashButton id={a.id} onClick={trashHandler} loading={deleting} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editAchievement && (
        <AchievementsEditModal achievementId={editAchievement.id} showModal={true} closeModal={closeModal} />
      )}
    </div>
  );
};

export default AchievementList;
