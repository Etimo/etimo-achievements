export type PaginationOptions = {
  skip: number;
  take: number;
  orderBy: OrderByOption[];
};

export type OrderByOption = [key: string, order: 'asc' | 'desc'];
