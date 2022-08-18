import { PaginationOptions } from '@etimo-achievements/types';
import { PaginatedData } from '.';

export function paginate<T>(data: T[], count: number, options: PaginationOptions): PaginatedData<T> {
  const { skip, take } = options;

  const currentPage = skip === 0 ? 1 : Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(count / take);
  const pagination = {
    data: data,
    pagination: {
      items: data.length,
      totalItems: count,
      itemsPerPage: take,
      currentPage,
      totalPages,
      nextLink: skip + take < count ? generateLink({ ...options, skip: skip + take }) : undefined,
      prevLink: skip - take >= 0 ? generateLink({ ...options, skip: skip - take }) : undefined,
      firstLink: generateLink({ ...options, skip: 0 }),
      lastLink: generateLink({ ...options, skip: skip + take * (totalPages - 1) }),
    },
  };

  return {
    ...pagination,
  };
}

function generateLink(options: PaginationOptions) {
  const { skip, take, orderBy, filters } = options;
  let link = `?skip=${skip}&take=${take}`;

  if (filters && Object.keys(filters).length !== 0) {
    link += Object.entries(filters)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');
  }

  // Add order by params
  for (const order of orderBy) {
    link += `&orderBy=${order[0]}~${order[1]}`;
  }

  return link;
}
