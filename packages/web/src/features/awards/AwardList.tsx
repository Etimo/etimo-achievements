import { formatNumber, sort } from '@etimo-achievements/common';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/store';
import { toastResponse } from '../../common/utils/toast-response';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import NewTable, { Column } from '../../components/table/NewTable';
import { AwardService } from './award-service';
import { awardSelector } from './award-slice';

const AwardList: React.FC = () => {
  const { composites } = useAppSelector(awardSelector);
  const awardService = new AwardService();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string>();

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

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <NewTable
        columns={columns}
        data={sort(composites, 'award.createdAt', 'desc').map((c) => ({
          name: c.achievement.name,
          awardedTo: c.awardedTo.name,
          points: `${formatNumber(c.achievement.achievementPoints)} pts`,
          date: new Date(c.award.createdAt ?? 0).toLocaleString('sv-SE'),
          awardedBy: c.awardedBy.name,
          delete: (
            <TrashButton id={c.award.id} onClick={trashHandler} loading={deleting} className="w-full text-center" />
          ),
        }))}
        pageCount={0}
        loading={false}
        fetchData={() => awardService.load()}
      />
    </div>
  );
};

export default AwardList;
