import { formatNumber, uuid } from '@etimo-achievements/common';
import React, { useState } from 'react';
import useQuery from '../../common/hooks/use-query';
import useRemoveQueryParam from '../../common/hooks/use-remove-query-param';
import { addQueryParam } from '../../common/utils/query-helper';
import { TrashButton } from '../../components/buttons';
import Header from '../../components/Header';
import PaginatedTable, { Column, PaginationRequestInput } from '../../components/table/PaginatedTable';
import { AwardComposite } from './award-types';
import { getManyAwards } from './award-utils';
import AwardDeleteModal from './AwardDeleteModal';

const AwardList: React.FC = () => {
  const query = useQuery();
  const removeQueryParam = useRemoveQueryParam();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const [data, setData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [monitor, setMonitor] = useState(uuid());

  const getDeleteId = () => query.get('delete') ?? '';

  const fetchData = async (input: PaginationRequestInput) => {
    setLoading(true);
    const response = await getManyAwards(input);
    if (response) {
      const { data, pagination } = response;
      setData(mapToData(data));
      setPageCount(pagination.totalPages ?? 0);
    }
    setLoading(false);
  };

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
        sortKey: 'createdAt',
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

  return (
    <div className="w-3/4 mx-auto">
      <Header>Awards</Header>
      <PaginatedTable
        columns={columns}
        data={data}
        pageCount={pageCount}
        loading={loading}
        monitor={monitor}
        fetchData={fetchData}
      />
      {getDeleteId() && (
        <AwardDeleteModal
          awardId={getDeleteId()}
          onClose={() => removeQueryParam('delete')}
          onSubmit={() => setMonitor(uuid())}
        />
      )}
    </div>
  );
};

export default AwardList;
