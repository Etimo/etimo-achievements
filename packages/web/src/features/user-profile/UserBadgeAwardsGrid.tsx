import React, { useEffect, useState } from 'react';
import { BadgeAwardComposite } from '../badge-awards/badge-award-types';
import { getManyBadgeAwards } from '../badge-awards/badge-award-utils';
import BadgeAward from './BadgeAward';

type Props = {
  userId: string;
};

const UserBadgeAwardsGrid: React.VFC<Props> = ({ userId }) => {
  const [data, setData] = useState<BadgeAwardComposite[]>([]);

  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    getManyBadgeAwards({ page, size: 50, filters: { userId } }).then((response) => {
      const { data: newData, pagination } = response;
      setData([...data, ...newData]);
      if (page === pagination.totalPages) {
        setIsLastPage(true);
      }
    });
  }, [page]);

  return (
    <div className="flex flex-wrap justify-center">
      {data.length === 0 && 'User has no badges'}
      {data.map((badge: any) => (
        <BadgeAward badge={badge} key={badge.badgeAward.id} />
      ))}
      {!isLastPage && data.length !== 0 && (
        <div className="flex items-center p-5">
          <span className="cursor-pointer" onClick={() => setPage(page + 1)}>
            Ladda fler
          </span>
        </div>
      )}
    </div>
  );
};

export default UserBadgeAwardsGrid;
