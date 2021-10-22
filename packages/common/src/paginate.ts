export type PageInfoType = {
  items: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
};

export type PaginationType<T> = {
  data: T[];
  pagination: PageInfoType;
};

export function paginate<T>(data: T[], skip: number, take: number, count: number): PaginationType<T> {
  const currentPage = skip === 0 ? 1 : Math.floor(skip / take) + 1;
  return {
    data: data,
    pagination: {
      items: data.length,
      totalItems: count,
      itemsPerPage: take,
      currentPage,
      totalPages: Math.ceil(count / take),
    },
  };
}
