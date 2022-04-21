import { PaginationOptions } from '@etimo-achievements/types';
import { PaginatedData, toBase64 } from '.';

export function paginate<T>(data: T[], count: number, options: PaginationOptions): PaginatedData<T> {
  const { skip, take } = options;

  const currentPage = skip === 0 ? 1 : Math.floor(skip / take) + 1;
  const pagination = {
    data: data,
    pagination: {
      items: data.length,
      totalItems: count,
      itemsPerPage: take,
      currentPage,
      totalPages: Math.ceil(count / take),
    },
  };

  let token: string | undefined = undefined;
  if (skip + take < count) {
    token = toBase64(JSON.stringify({ ...options, skip: options.skip + options.take }));
  }

  return {
    ...pagination,
    nextPageToken: token,
  };
}
