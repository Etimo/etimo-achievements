import { AwardDto, formatNumber, sort, uuid } from '@etimo-achievements/common';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { AwardApi } from './award-api';
import { AwardService } from './award-service';
import { awardSelector } from './award-slice';
import { AwardComposite } from './award-types';

const AwardList: React.FC = () => {
  const { composites } = useAppSelector(awardSelector);
  const awardApi = new AwardApi();
  const awardService = new AwardService();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());

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
      },
      {
        title: 'Points',
        accessor: 'points',
      },
      {
        title: 'Date',
        accessor: 'date',
      },
      {
        title: 'Awarded By',
        accessor: 'awardedBy',
      },
      {
        title: 'Delete',
        accessor: 'delete',
      },
    ],
    []
  );

  const mapToData = (achievements: AwardComposite[]): any[] => {
    return achievements.map((c) => ({
          id: c.award.id,
          name: c.achievement.name,
          awardedTo: c.awardedTo.name,
          points: `${formatNumber(c.achievement.achievementPoints)} pts`,
          date: new Date(c.award.createdAt ?? 0).toLocaleString('sv-SE'),
          awardedBy: c.awardedBy.name,
          delete: (
            <TrashButton id={c.award.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />
          ),
        }));
  };

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <NewTable
        columns={columns}
        data={sort(composites, 'award.createdAt', 'desc').}
        pageCount={0}
        loading={false}
        fetchData={useCallback(
          (input: { size: any; page: any }) => {
            const { size, page } = input;
            setLoading(true);
            awardService
              .load((page - 1) * size, size)
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
      />
    </div>
  );
};

export default AwardList;
