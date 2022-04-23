import { formatNumber, uuid } from '@etimo-achievements/common';
import React, { useCallback, useState } from 'react';
import { toastResponse } from '../../common/utils/toast-response';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { AwardService } from './award-service';
import { AwardComposite } from './award-types';

const AwardList: React.FC = () => {
  const awardService = new AwardService();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());

  const trashHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDeleting(e.currentTarget.id);
    awardService.delete(e.currentTarget.id).then((response) => {
      if (response.success) {
        setMonitor(uuid());
      }
      setDeleting(undefined);
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
        className: 'w-16',
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
      delete: <TrashButton id={c.award.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />,
    }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <NewTable
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
    </div>
  );
};

export default AwardList;
