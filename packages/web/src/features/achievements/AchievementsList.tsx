import { AchievementDto } from '@etimo-achievements/common';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { useAppSelector } from '../../app/store';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '../../components/table';
import TrashButton from '../../components/TrashButton';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';
import AchievementsEdit from './AchievementsEdit';

const AchievementsList: React.FC = () => {
  const { achievements } = useAppSelector(achievementSelector);
  const achievementService = new AchievementService();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [achievement, setAchievement] = useState(null as AchievementDto | null);
  const toggleModal = () => setShowModal(!showModal);
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

  const editHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(achievements);
    console.log(e.currentTarget.id);
    const achievement = achievements.find((a) => a.id === e.currentTarget.id);
    if (achievement) {
      setAchievement(achievement);
      setShowModal(true);
    }
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
          <TableColumn>Edit</TableColumn>
          <TableColumn>Delete</TableColumn>
        </TableHeader>
        <TableBody>
          {achievements.map((a: AchievementDto) => (
            <TableRow key={a.id}>
              <TableCell>{a.name}</TableCell>
              <TableCell>{a.description}</TableCell>
              <TableCell>{formatNumber(a.achievementPoints)} pts</TableCell>
              <TableCell>{formatNumber(a.cooldownMinutes)} min</TableCell>
              <TableCell>Unsupported</TableCell>
              <TableCell>
                <button id={a.id} onClick={editHandler}>
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </TableCell>
              <TableCell className="text-center">
                <TrashButton id={a.id} onClick={trashHandler} loading={loading} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ReactModal isOpen={showModal} className="w-1/3 mx-auto">
        {achievement && <AchievementsEdit achievement={achievement} />}
        <button onClick={toggleModal}>Close</button>
      </ReactModal>
    </div>
  );
};

export default AchievementsList;
