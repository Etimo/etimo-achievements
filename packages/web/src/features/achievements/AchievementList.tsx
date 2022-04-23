import { AchievementDto, formatNumber, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { addQueryParam, queryParam, removeQueryParam } from '../../common/utils/query-helper';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { AchievementApi } from './achievement-api';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const achievementApi = new AchievementApi();

  const getEditId = () => queryParam<string>(window.location, 'edit', '');

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
        className: 'w-48',
      },
      {
        title: 'Description',
        accessor: 'description',
      },
      {
        title: 'Points',
        accessor: 'points',
        className: 'w-32',
      },
      {
        title: 'Cooldown',
        accessor: 'cooldown',
        className: 'w-32',
      },
      {
        title: 'Repeatable',
        accessor: 'repeatable',
        className: 'w-32',
      },
      {
        title: 'Edit',
        accessor: 'edit',
        className: 'w-16',
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16',
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
      edit: <EditButton id={a.id} link={addQueryParam(window.location, 'edit', a.id)} className="w-full text-center" />,
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
                    setData(mapToData(data));
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
      {getEditId() && (
        <AchievementsEditModal
          achievementId={getEditId()}
          showModal={true}
          closeModal={() => {
            navigate(removeQueryParam(window.location, 'edit'));
            setMonitor(uuid());
          }}
        />
      )}
    </div>
  );
};

export default AchievementList;
