import { fromBase64 } from '@etimo-achievements/common';
import { OrderByOption, PaginationOptions } from '@etimo-achievements/types';

export function getPaginationOptions(req: any, max: number = 50): PaginationOptions {
  const [skip, take] = getSkipAndTake(req, max);
  const orderBy = getOrderBy(req);

  const token = req.query.pageToken ? (req.query.pageToken as string) : null;
  if (token) {
    const pagination = JSON.parse(fromBase64(token)) as PaginationOptions;

    if (req.query.skip !== undefined && req.query.take !== undefined) {
      return { ...pagination, skip, take };
    }

    return pagination;
  }

  return {
    skip,
    take,
    orderBy,
  };
}

export function getSkipAndTake(req: any, max: number = 50): [number, number] {
  let skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
  skip = Math.max(skip, 0);

  let take = req.query.take ? parseInt(req.query.take as string, 10) : 10;
  take = Math.min(take, max);
  take = Math.max(1, take);

  if (skip > 0) {
    take = Math.min(skip, take);
    if (skip % take !== 0) {
      take = skip / (skip % take);
    }
  }

  return [skip, take];
}

export function getOrderBy(req: any): OrderByOption[] {
  const orderBy = req.query.orderBy ? (req.query.orderBy as string[]) : [];

  return orderBy.map((o) => {
    const [key, orderStr] = o.split(',');
    const order = orderStr === 'desc' ? 'desc' : 'asc';
    return [key, order];
  });
}
