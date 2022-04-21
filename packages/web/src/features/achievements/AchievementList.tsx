import { AchievementDto, formatNumber, uuid } from '@etimo-achievements/common';
import React, { useState } from 'react';
import { Column } from 'react-table';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { insensitiveSort, numberSort } from '../../common/utils/react-table-helpers';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable from '../../components/table/NewTable';
import { AchievementApi } from './achievement-api';
import { achievementSelector, setAchievements } from './achievement-slice';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { achievements } = useAppSelector(achievementSelector);
  const achievementApi = new AchievementApi();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const [editAchievement, setEditAchievement] = useState<AchievementDto>();

  const closeModal = () => {
    setEditAchievement(undefined);
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
        Header: 'ID',
        accessor: 'id',
      },
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

  const mapToData = (achievements: AchievementDto[]): any[] => {
    return achievements.map((a) => ({
      id: a.id,
      name: a.name,
      description: a.description,
      points: `${formatNumber(a.achievementPoints)} pts`,
      cooldown: `${formatNumber(a.cooldownMinutes)} min`,
      repeatable: 'Unsupported',
      edit: <EditButton id={a.id} onClick={editHandler} className="w-full text-center" />,
      delete: <TrashButton id={a.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
    }));
  };

  const fetchData = (input: { pageSize: number; pageIndex: number }) => {
    const { pageSize, pageIndex } = input;
    setLoading(true);
    setPageIndex(pageIndex);
    setPageSize(pageSize);
    console.log(pageSize, pageIndex);
    achievementApi
      .getMany(pageIndex * pageSize, pageSize)
      .wait()
      .then((response) => {
        if (response.success) {
          response.data().then((slice) => {
            dispatch(setAchievements(slice.data));
            setData(mapToData(slice.data));
            setPageCount(slice.pagination.totalPages);
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Achievements</Header>
      <NewTable
        columns={columns}
        data={data}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
        hiddenColumns={['id']}
      />
      {editAchievement && (
        <AchievementsEditModal achievementId={editAchievement.id} showModal={true} closeModal={closeModal} />
      )}
    </div>
  );
};

export default AchievementList;
