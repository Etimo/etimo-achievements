import { AchievementDto, formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { Column } from 'react-table';
import { useAppSelector } from '../../app/store';
import { insensitiveSort, numberSort } from '../../common/utils/react-table-helpers';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable from '../../components/table/NewTable';
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

  const columns = React.useMemo(
    (): Column[] => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: insensitiveSort,
      },
      {
        Header: 'Description',
        accessor: 'description',
        sortType: insensitiveSort,
      },
      {
        Header: 'Points',
        accessor: 'points',
        sortType: numberSort,
      },
      {
        Header: 'Cooldown',
        accessor: 'cooldown',
        sortType: numberSort,
      },
      {
        Header: 'Repeatable',
        accessor: 'repeatable',
      },
      {
        Header: 'Edit',
        accessor: 'edit',
      },
      {
        Header: 'Delete',
        accessor: 'delete',
      },
    ],
    []
  );

  return (
    <div className="w-3/4 mx-auto">
      <Header>Achievements</Header>
      <NewTable
        columns={columns}
        data={sort(achievements, 'name', 'asc').map((a) => ({
          name: a.name,
          description: a.description,
          points: `${formatNumber(a.achievementPoints)} pts`,
          cooldown: `${formatNumber(a.cooldownMinutes)} min`,
          repeatable: 'Unsupported',
          edit: <EditButton id={a.id} onClick={editHandler} className="w-full text-center" />,
          delete: <TrashButton id={a.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
        }))}
      />
      {editAchievement && (
        <AchievementsEditModal achievementId={editAchievement.id} showModal={true} closeModal={closeModal} />
      )}
    </div>
  );
};

export default AchievementList;
