import { formatNumber, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { toastResponse } from '../../common/utils/toast-response';
import { TrashButton } from '../../components/buttons';
import ConfirmModal from '../../components/ConfirmModal';
import Header from '../../components/Header';
import RequirePermission from '../../components/RequirePermission';
import PaginatedTable, { Column } from '../../components/table/PaginatedTable';
import { AwardService } from './award-service';
import { AwardComposite } from './award-types';

const AwardList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());
  const awardService = new AwardService();

  const getDeleteId = () => query.get('delete') ?? '';

  const trashHandler = (awardId: string) => {
    setDeleting(awardId);
    awardService.delete(awardId).then((response) => {
      if (response.success) {
        setMonitor(uuid());
      }
      setDeleting(undefined);
      removeQueryParam('delete');
      toastResponse(response, 'Award deleted successfully', 'Award could not be deleted');
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
        title: 'Awarded To',
        accessor: 'awardedTo',
        className: 'w-40',
      },
      {
        title: 'Points',
        accessor: 'points',
        className: 'w-32',
      },
      {
        title: 'Date',
        accessor: 'date',
        className: 'w-48',
      },
      {
        title: 'Awarded By',
        accessor: 'awardedBy',
        className: 'w-40',
      },
      {
        title: 'Delete',
        accessor: 'delete',
        className: 'w-16 text-center',
        hasAccess: ['remove', 'awards'],
      },
    ],
    []
  );

  const mapToData = (composites: AwardComposite[]): any[] => {
    return composites.map((c) => ({
      id: c.award.id,
      name: c.achievement.name,
      awardedTo: c.awardedTo.name,
      points: `${formatNumber(c.achievement.achievementPoints)} pts`,
      date: new Date(c.award.createdAt ?? 0).toLocaleString('sv-SE'),
      awardedBy: c.awardedBy.name,
      delete: (
        <TrashButton id={c.award.id} link={addQueryParam(window.location, 'delete', c.award.id)} loading={deleting} />
      ),
    }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={useCallback(
          (input: { size: any; page: any }) => {
            const { size, page } = input;
            setLoading(true);
            awardService.load((page - 1) * size, size).then((response) => {
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
      />
      {getDeleteId() && (
        <RequirePermission remove="awards">
          <ConfirmModal
            title="Confirm delete"
            cancelLabel="No"
            confirmLabel="Yes"
            onCancel={() => {
              removeQueryParam('delete');
            }}
            onConfirm={() => {
              trashHandler(getDeleteId());
            }}
          >
            <div className="text-center">Are you sure you want to delete this award?</div>
            <div className="text-center pt-5 text-2xl">
              {data.find((c) => c.id === getDeleteId())?.name} (awarded to{' '}
              {data.find((c) => c.id === getDeleteId())?.awardedTo})
            </div>
          </ConfirmModal>
        </RequirePermission>
      )}
    </div>
  );
};

export default AwardList;
