import { AchievementDto, formatNumber, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { useAppSelector } from '../../app/store';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { toastResponse } from '../../common/utils/toast-response';
import { EditButton, TrashButton } from '../../components/buttons';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import PaginatedTable, { Column } from '../../components/table/PaginatedTable';
import { AchievementService } from './achievement-service';
import { achievementSelector } from './achievement-slice';
import AchievementsEditModal from './AchievementEditModal';

const AchievementList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const { achievements } = useAppSelector(achievementSelector);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const achievementService = new AchievementService();

  const getEditId = () => query.get('edit') ?? '';
  const getDeleteId = () => query.get('delete') ?? '';

  const trashHandler = (achievementId: string) => {
    setDeleting(achievementId);
    achievementService.delete(achievementId).then((response) => {
      if (response.success) {
        setMonitor(uuid());
      }
      setDeleting(undefined);
      removeQueryParam('delete');
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
        hasAccess: ['update', 'achievements'],
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16',
        hasAccess: ['remove', 'achievements'],
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
      delete: (
        <TrashButton
          id={a.id}
          link={addQueryParam(window.location, 'delete', a.id)}
          loading={deleting}
          className="w-full text-center"
        />
      ),
    }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Achievements</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        fetchData={useCallback(
          (input: { size: any; page: any }) => {
            const { size, page } = input;
            setLoading(true);
            achievementService.getMany((page - 1) * size, size).then((response) => {
              if (response) {
                const { data, pagination } = response;
                setData(mapToData(data));
                setPageCount(pagination.totalPages ?? 0);
              }
              setLoading(false);
            });
          },
          [monitor]
        )}
        loading={loading}
        pageCount={pageCount}
        monitor={monitor}
      />
      {getEditId() && (
        <RequirePermission update="achievements">
          <AchievementsEditModal
            achievementId={getEditId()}
            closeModal={() => {
              removeQueryParam('edit');
              setMonitor(uuid());
            }}
          />
        </RequirePermission>
      )}
      {getDeleteId() && (
        <RequirePermission remove="achievements">
          <ConfirmModal
            title="Delete achievement"
            cancelLabel="No"
            confirmLabel="Yes"
            onCancel={() => {
              removeQueryParam('delete');
            }}
            onConfirm={() => {
              trashHandler(getDeleteId());
            }}
          >
            <div className="text-center">Are you sure you want to delete this achievement?</div>
            <div className="text-center pt-5 text-2xl">{achievements.find((a) => a.id === getDeleteId())?.name}</div>
          </ConfirmModal>
        </RequirePermission>
      )}
    </div>
  );
};

export default AchievementList;
