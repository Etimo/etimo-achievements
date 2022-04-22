import { AchievementDto, formatNumber, uuid } from '@etimo-achievements/common';
import React, { useCallback, useEffect, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { AchievementApi } from './achievement-api';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const query = useQuery();
  const [achievements, setAchievements] = useState<AchievementDto[]>([]);
  const achievementApi = new AchievementApi();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const [editAchievementId, setEditAchievementId] = useState<string>();

  useEffect(() => {
    const achievementId = query.get('edit');
    if (achievementId) setEditAchievementId(achievementId);
  }, [query]);

  const closeModal = () => {
    setEditAchievementId(undefined);
  };

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    achievementApi
      .delete(e.currentTarget.id)
      .wait()
      .then((response) => {
        if (response.success) {
          setMonitor(uuid());
        }
        setDeleting(undefined);
        toastResponse(response, 'Achievement deleted successfully', 'Achievement could not be deleted');
      });
  };

  const columns = React.useMemo(
    (): Column[] => [
      {
        title: 'ID',
        accessor: 'id',
        hidden: true,
      },
      {
        title: 'Name',
        accessor: 'name',
      },
      {
        title: 'Description',
        accessor: 'description',
      },
      {
        title: 'Points',
        accessor: 'points',
      },
      {
        title: 'Cooldown',
        accessor: 'cooldown',
      },
      {
        title: 'Repeatable',
        accessor: 'repeatable',
      },
      {
        title: 'Edit',
        accessor: 'edit',
      },
      {
        title: 'Delete',
        accessor: 'delete',
      },
    ],
    []
  );

  const mapToData = (achievements: AchievementDto[]): any[] => {
    return achievements.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      points: `${formatNumber(a.achievementPoints)} pts`,
      cooldown: `${formatNumber(a.cooldownMinutes)} min`,
      repeatable: 'Unsupported',
      edit: (
        <EditButton
          id={a.id}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const achievement = achievements.find((a) => a.id === e.currentTarget.id);
            if (achievement) {
              setEditAchievementId(achievement.id);
            }
          }}
          className="w-full text-center"
        />
      ),
      delete: <TrashButton id={a.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
    }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Achievements</Header>
      <NewTable
        columns={columns}
        data={data}
        fetchData={useCallback(
          (input: { size: any; page: any }) => {
            const { size, page } = input;
            setLoading(true);
            achievementApi
              .getMany((page - 1) * size, size)
              .wait()
              .then((response) => {
                if (response.success) {
                  response.data().then((data) => {
                    setAchievements(data);
                    setData(mapToData(data));
                    console.log(response);
                    setPageCount(response.pagination?.totalPages ?? 0);
                  });
                }
                setLoading(false);
              });
          },
          [monitor]
        )}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
        hiddenColumns={['id']}
      />
      {editAchievementId && (
        <AchievementsEditModal
          achievementId={editAchievementId}
          showModal={true}
          closeModal={() => {
            closeModal();
            setMonitor(uuid());
          }}
        />
      )}
    </div>
  );
};

export default AchievementList;
