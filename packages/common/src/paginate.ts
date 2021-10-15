export type PaginationType<T> = {
  totalItems: number;
  items: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  data: T[];
};

export function paginate<T>(data: T[], skip: number, take: number, count: number): PaginationType<T> {
  const currentPage = skip === 0 ? 1 : Math.floor(skip / take) + 1;
  return {
    totalItems: count,
    items: data.length,
    itemsPerPage: take,
    currentPage,
    totalPages: Math.ceil(count / take),
    data: data,
  };
}
